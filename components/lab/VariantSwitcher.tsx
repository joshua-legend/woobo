"use client";

import {
  SECTION_VARIANTS,
  type SectionKey,
  type Variants,
} from "@/lib/variants";
import styles from "./VariantSwitcher.module.css";

// 다른 섹션 파라미터는 보존하고 한 섹션만 바꾼 쿼리스트링 생성.
function hrefFor(current: Variants, key: SectionKey, value: string) {
  const params = new URLSearchParams();
  for (const k of Object.keys(current) as SectionKey[]) {
    params.set(k, k === key ? value : current[k]);
  }
  return `?${params.toString()}`;
}

/**
 * 검수용 변주 스위처(우하단 고정). 레지스트리를 순회해 섹션별 옵션을 버튼으로 노출.
 * 클릭 = 일반 <a> 풀 리로드 → 서버가 변주를 다시 고르고 useReveal 도 새로 관찰(정합).
 * 변주 확정 시 이 컴포넌트 마운트만 제거하면 됨.
 */
export function VariantSwitcher({ current }: { current: Variants }) {
  return (
    <aside className={styles.panel} aria-label="변주 스위처 (검수용)">
      <div className={styles.title}>VARIANTS · 검수용</div>
      {(Object.keys(SECTION_VARIANTS) as SectionKey[]).map((key) => {
        const cfg = SECTION_VARIANTS[key];
        return (
          <div className={styles.row} key={key}>
            <span className={styles.label}>{cfg.label}</span>
            <div className={styles.opts}>
              {cfg.options.map((opt) => (
                <a
                  key={opt}
                  href={hrefFor(current, key, opt)}
                  className={
                    current[key] === opt
                      ? `${styles.opt} ${styles.active}`
                      : styles.opt
                  }
                >
                  {opt}
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
