"use client"

import { Mic, MicOff, PhoneOff, Video, VideoOff, Signal, Users } from "lucide-react"
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from "../../context/SocketContext"
import peer from "../../services/peer"

const VideoPage = ({ role }) => {
  const params = useParams()
  const room = params.room

  const { socket } = useSocket();
  const router = useRouter();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const handleUserJoined = useCallback(({ id }) => {
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: true,
    });
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  }, [socket]);

  const toggleVideo = useCallback(() => {
    if (myStream) {
      myStream.getVideoTracks().forEach(track => { track.enabled = !track.enabled; });
    }
  }, [myStream]);

  const sendStreams = useCallback(() => {
    if (!peer || !peer.peer) return;
    myStream.getTracks().forEach((track) => {
      const existingSender = peer.peer.getSenders().find((s) => s.track === track);
      if (!existingSender) peer.peer.addTrack(track, myStream);
    });
  }, [myStream, remoteStream, peer]);

  const handleCallAccepted = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans);
    sendStreams();
  }, [sendStreams]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    if (!peer || !peer.peer) return;
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => { if (peer.peer) peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded); };
  }, [handleNegoNeeded, peer]);

  const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans });
  }, [socket, remoteSocketId]);

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleDisconnect = useCallback(() => {
    peer.closeConnection();
    if (myStream) { myStream.getTracks().forEach(t => t.stop()); setMyStream(null); }
    if (remoteStream) { remoteStream.getTracks().forEach(t => t.stop()); setRemoteStream(null); }
    if (remoteSocketId) socket.emit("user:disconnect", { to: remoteSocketId, room });
    socket.emit("single_disconnect", { room });
    setRemoteSocketId(null);
    router.push("/");
  }, [myStream, remoteStream, remoteSocketId, socket]);

  useEffect(() => {
    if (peer && peer.peer) {
      peer.peer.addEventListener("track", async (ev) => { setRemoteStream(ev.streams[0]); });
      return () => { if (peer && peer.peer) peer.peer.removeEventListener("track", () => {}); };
    }
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("user:disconnected", handleDisconnect);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("user:disconnected", handleDisconnect);
    };
  }, [socket, handleUserJoined, handleIncommingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal]);

  return (
    <div className="flex flex-col h-screen bg-[#0c0c14] text-white overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .pip-shadow { box-shadow: 0 0 0 2px rgba(139,92,246,0.5), 0 8px 32px rgba(0,0,0,0.6); }
        .ctrl-btn { transition: all 0.2s ease; }
        .ctrl-btn:hover { transform: scale(1.08); }
        .ctrl-btn:active { transform: scale(0.95); }
        .video-bg { background: radial-gradient(ellipse at center, #1a1a2e 0%, #0c0c14 100%); }
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0c0c14]/80 backdrop-blur-sm border-b border-white/5 z-10">
        {/* Status pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          remoteSocketId
            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
            : "bg-amber-500/10 border-amber-500/25 text-amber-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${remoteSocketId ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          {remoteSocketId ? "Connected" : "Waiting for participant..."}
        </div>

        {/* Room ID */}
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <Signal className="w-3.5 h-3.5" />
          Room: <span className="text-white/50 font-mono">{room}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {myStream && (
            <button
              onClick={sendStreams}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-all duration-200"
            >
              <Users className="w-3.5 h-3.5" /> Share Stream
            </button>
          )}
          {remoteSocketId && role === "recruiter" && (
            <button
              onClick={handleCallUser}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all duration-200"
            >
              <Video className="w-3.5 h-3.5" /> Start Call
            </button>
          )}
        </div>
      </div>

      {/* ── VIDEO AREA ── */}
      <div className="relative flex-1 video-bg overflow-hidden">

        {/* Remote stream — full area */}
        {remoteStream ? (
          <ReactPlayer
            playing
            height="100%"
            width="100%"
            url={remoteStream}
            style={{ position: "absolute", inset: 0 }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Video className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/25 text-sm">
              {remoteSocketId ? "Connecting video..." : "No one has joined yet"}
            </p>
          </div>
        )}

        {/* PiP — my stream */}
        <div className="absolute bottom-5 right-5 w-36 md:w-44 aspect-video rounded-2xl overflow-hidden pip-shadow z-10 bg-[#1a1a2e]">
          {myStream ? (
            <ReactPlayer playing muted height="100%" width="100%" url={myStream} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <Video className="w-5 h-5 text-white/20" />
            </div>
          )}
          <div className="absolute bottom-1.5 left-2 text-[10px] text-white/50 font-medium">You</div>
        </div>

        {/* Subtle top-left room overlay */}
        {remoteStream && (
          <div className="absolute top-3 left-3 z-10 text-xs text-white/30 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {role === "recruiter" ? "Interview Room" : "Candidate View"}
          </div>
        )}
      </div>

      {/* ── CONTROLS ── */}
      <div className="flex items-center justify-center gap-4 py-5 bg-[#0c0c14]/90 backdrop-blur-sm border-t border-white/5">

        {/* Mute */}
        <button
          className={`ctrl-btn w-12 h-12 flex items-center justify-center rounded-2xl border ${
            isMuted
              ? "bg-red-500/20 border-red-500/40 text-red-400"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* End call */}
        <button
          className="ctrl-btn w-14 h-14 flex items-center justify-center rounded-2xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40"
          onClick={handleDisconnect}
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>

        {/* Video toggle */}
        <button
          className={`ctrl-btn w-12 h-12 flex items-center justify-center rounded-2xl border ${
            isVideoOff
              ? "bg-red-500/20 border-red-500/40 text-red-400"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
          onClick={() => { setIsVideoOff(!isVideoOff); toggleVideo(); }}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

export default VideoPage;