"use client";

import { useEffect, useState } from "react";

/**
 * 카카오톡 인앱 브라우저 탈출.
 * - Android: 카톡 openExternal 스킴으로 기기 기본 브라우저 자동 오픈.
 * - iOS: 외부 브라우저 강제 전환 불가(애플 차단) → "Safari로 열기" 안내 배너(세션당 1회).
 * - 그 외(데스크톱·일반 모바일 브라우저): 아무 동작 안 함.
 */
export function KakaoEscape() {
  const [guide, setGuide] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (!/KAKAOTALK/i.test(ua)) return;

    if (/android/i.test(ua)) {
      // 카톡 앱이 처리 → 현재 URL을 기기 기본 브라우저로 오픈
      location.href =
        "kakaotalk://web/openExternal?url=" + encodeURIComponent(location.href);
      return;
    }

    // iOS 등: 자동 전환 불가 → 안내만 (한 번 닫으면 세션 내 다시 안 뜸)
    if (sessionStorage.getItem("kakaoGuideDismissed")) return;
    setGuide(true);
  }, []);

  if (!guide) return null;

  return (
    <div className="kakao-guide" role="note">
      <p>
        Safari에서 더 부드럽게 보입니다.
        <br />
        우측 하단 <b>⋯</b> 또는 공유 → <b>Safari로 열기</b>
      </p>
      <button
        type="button"
        aria-label="안내 닫기"
        onClick={() => {
          sessionStorage.setItem("kakaoGuideDismissed", "1");
          setGuide(false);
        }}
      >
        ✕
      </button>
    </div>
  );
}
