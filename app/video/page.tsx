"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:5000");

export default function VideoCallPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const router = useRouter();

  useEffect(() => {
    socket.on("offer", async (offer) => {
      if (!peerConnection.current) return;

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", (candidate) => {
      if (!peerConnection.current) return;
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, []);

  const startCall = async () => {
    setIsCalling(true);
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream.current!);
    });

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  const endCall = () => {
    setIsCalling(false);
    localStream.current?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
    peerConnection.current = null;
    router.push("/chat"); // Navigate back to the chat page
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const addPerson = () => {
    alert("Feature to add people will be implemented in the backend.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="relative w-full max-w-4xl flex justify-center gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          className="border-4 border-blue-500 rounded-lg w-1/2 h-auto aspect-video bg-black"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="border-4 border-green-500 rounded-lg w-1/2 h-auto aspect-video bg-black"
        />
      </div>
      <div className="mt-6 flex gap-4">
        {isCalling ? (
          <>
            <Button onClick={toggleMute} className="bg-gray-600 text-white px-4 py-2 rounded-lg">
              {isMuted ? "Unmute 🎤" : "Mute 🔇"}
            </Button>
            <Button onClick={toggleVideo} className="bg-gray-600 text-white px-4 py-2 rounded-lg">
              {isVideoOff ? "Turn Video On 📹" : "Turn Video Off 📷"}
            </Button>
            <Button onClick={endCall} className="bg-red-600 text-white px-6 py-2 rounded-lg">
              End Call
            </Button>
          </>
        ) : (
          <Button onClick={startCall} className="bg-green-600 text-white px-6 py-2 rounded-lg">
            Start Call
          </Button>
        )}
        <Button onClick={addPerson} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Add People ➕
        </Button>
      </div>
    </div>
  );
}
