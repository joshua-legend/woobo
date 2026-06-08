import Link from "next/link";
import styles from "./gateway.module.css";

const GATES = [
  {
    num: "01",
    href: "/manifesto",
    kind: "선언 · 증거형",
    name: "매니페스토",
    desc: "현장의 문제 제기에서 정품의 공식 통로로. 제품 데모 3종으로 신념을 증명하는 선언형 롱폼.",
    route: "/manifesto",
  },
  {
    num: "02",
    href: "/problem",
    kind: "문제 해결형",
    name: "문제해결",
    desc: "병행수입·유사품·실물 미확인의 불안을 정품의 공식 통로로 전환. 핀 스크롤 데모가 해결을 증명.",
    route: "/problem",
  },
  {
    num: "03",
    href: "/origin",
    kind: "기원 서사형",
    name: "기원 서사",
    desc: "‘좋은 움직임이 좋은 가구를 만든다.’ 우보의 여정과 Blum 헤리티지 타임라인으로 풀어내는 서사.",
    route: "/origin",
  },
];

export default function Home() {
  return (
    <main className={styles.gate}>
      <div className={styles.top}>
        <span className={styles.brand}>
          Woobo<span className={styles.dot}>.</span>
          <small>Blum 한국 독점 에이전트</small>
        </span>
        <span className={styles.note}>Concept Selector · 가안 3종</span>
      </div>

      <header className={styles.head}>
        <span className={styles.eyebrow}>가안 셀렉터 / CONCEPT SELECTOR</span>
        <h1 className={styles.title}>
          세 가지 내러티브, <span className={styles.hl}>하나의 움직임</span>.
        </h1>
        <p className={styles.sub}>
          우보브랜드샵(Blum 한국 독점 에이전트) 랜딩의 세 가지 방향입니다. 디자인
          시스템·인터랙션·쇼룸 예약 동선은 공유하되, 이야기를 푸는 방식이 다릅니다.
        </p>
      </header>

      <div className={styles.cards}>
        {GATES.map((g) => (
          <Link key={g.href} href={g.href} className={styles.card}>
            <div className={styles.num}>{g.num}</div>
            <div className={styles.kind}>{g.kind}</div>
            <div className={styles.name}>{g.name}</div>
            <p className={styles.desc}>{g.desc}</p>
            <div className={styles.route}>{g.route}</div>
            <span className={styles.go}>
              가안 보기 <span className={styles.arr}>→</span>
            </span>
          </Link>
        ))}
      </div>

      <div className={styles.foot}>
        Woobo · 우보브랜드샵 · moving ideas — placeholder·미확정값은 추후 교체 [TODO]
      </div>
    </main>
  );
}
