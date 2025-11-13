import React, { useEffect, useRef } from "react";

export default function Advertisement() {
  const bgRef = useRef<HTMLVideoElement | null>(null);
  const mainRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const bgVideo = bgRef.current;
    const mainVideo = mainRef.current;

    if (!bgVideo || !mainVideo) return;

    // 🔹 Ikkalasini boshidan sinxronlashtirish
    const syncPlay = async () => {
      try {
        bgVideo.currentTime = 0;
        mainVideo.currentTime = 0;

        // Har ikkisini parallel autoplay qilish
        await Promise.allSettled([bgVideo.play(), mainVideo.play()]);
      } catch (err) {
        console.warn("Autoplay bloklandi:", err);
      }
    };

    syncPlay();
  }, []);

  return (
    <div className="ads-resturant-frame">
      {/* 🔹 Orqa blur video */}
      <video
        ref={bgRef}
        className="ads-video-bg"
        loop
        muted
        playsInline
        autoPlay
      >
        <source src="video/qaysar-ads.mp4" type="video/mp4" />
      </video>

      {/* 🔹 Oldingi video */}
      <video
        ref={mainRef}
        className="ads-video-main"
        loop
        muted
        playsInline
        autoPlay
      >
        <source src="video/qaysar-ads.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
