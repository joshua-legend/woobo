"use client";

import { useEffect, useRef, useState } from "react";

/* 카카오 지도 JS 키(공개 env). .env.local 에 NEXT_PUBLIC_KAKAO_JS_KEY=... */
const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

// SDK 1회 로드(싱글톤). services 라이브러리 = 주소 지오코딩.
let sdkPromise: Promise<unknown> | null = null;
function loadKakao(): Promise<unknown> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  const w = window as unknown as { kakao?: { maps?: unknown } };
  if (w.kakao?.maps) return Promise.resolve(w.kakao);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`;
    s.onload = () =>
      (
        window as unknown as {
          kakao: { maps: { load: (cb: () => void) => void } };
        }
      ).kakao.maps.load(() => resolve((window as { kakao?: unknown }).kakao));
    s.onerror = () => reject(new Error("kakao sdk load failed"));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

/* 선택 지점 라이브 카카오 미니맵(주소 지오코딩 → 마커). 키 없으면 안내 폴백. */
export function KakaoMiniMap({ address }: { address: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "nokey" | "error">(
    KAKAO_KEY ? "loading" : "nokey",
  );
  // 뷰포트 진입 전까지 SDK 로드·맵 초기화 보류 → 5~6번 구간 스크롤 부담 제거.
  const [active, setActive] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!KAKAO_KEY || !box || active) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      // 도착 직전 살짝 미리 로드(도착 시 빈 화면 방지).
      { rootMargin: "200px 0px", threshold: 0 },
    );
    io.observe(box);
    return () => io.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active || !KAKAO_KEY || !boxRef.current) return;
    let alive = true;
    loadKakao()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((kakao: any) => {
        if (!alive || !boxRef.current) return;
        if (!mapRef.current) {
          mapRef.current = new kakao.maps.Map(boxRef.current, {
            center: new kakao.maps.LatLng(36.5, 127.8),
            level: 5,
          });
        }
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(
          address,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res: any[], st: string) => {
            if (!alive) return;
            if (st === kakao.maps.services.Status.OK && res[0]) {
              const ll = new kakao.maps.LatLng(res[0].y, res[0].x);
              mapRef.current.setCenter(ll);
              mapRef.current.setLevel(4);
              if (markerRef.current) markerRef.current.setMap(null);
              markerRef.current = new kakao.maps.Marker({
                position: ll,
                map: mapRef.current,
              });
              setStatus("ready");
            } else {
              setStatus("error");
            }
          },
        );
      })
      .catch(() => {
        if (alive) setStatus("error");
      });
    return () => {
      alive = false;
    };
  }, [address, active]);

  if (status === "nokey") {
    return (
      <div
        className="sr-kakaomini ph"
        data-ph="카카오 지도 — NEXT_PUBLIC_KAKAO_JS_KEY 설정 후 표시"
      />
    );
  }
  return (
    <div className="sr-kakaomini">
      <div ref={boxRef} className="sr-kakaomini__map" />
      {status === "loading" && (
        <div className="sr-kakaomini__skel" aria-hidden="true">
          지도 불러오는 중…
        </div>
      )}
      {status === "error" && (
        <span className="sr-kakaomini__err">
          지도에서 주소를 못 찾았습니다 — 카카오맵 링크를 이용하세요.
        </span>
      )}
    </div>
  );
}
