"use client";

import { useEffect, useState } from "react";

type GameStep = "conversation" | "gauge" | "menu" | "result";

const menus = [
  "순두부찌개",
  "돈까스",
  "생선구이",
  "한우국밥",
  "비빔밥",
  "퇴근",
  "퇴근",
  "퇴근",
  "짱개",
  "홍어삼합",
  "마라탕"
];

// 만년과장 기본 표정
const NPC_DEFAULT = "/images/character/npc_emotionless.png";

// 플레이어 기본 표정
const PLAYER_DEFAULT = "/images/character/emotionless.png";

export default function Home() {
  const [gameStep, setGameStep] =
    useState<GameStep>("conversation");

  const [power, setPower] = useState(0);
  const [selectedPower, setSelectedPower] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(true);

  // 만년과장 표정
  const [npcExpression, setNpcExpression] =
    useState(NPC_DEFAULT);

  // 플레이어 표정
  const [playerExpression, setPlayerExpression] =
    useState(PLAYER_DEFAULT);

  // 메뉴 게임
  const [menuPosition, setMenuPosition] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState("");

  /*
   * 강도에 따른 만년과장 표정
   */
  const getNpcExpression = (value: number) => {
    if (value <= 20) {
      return "/images/character/npc_soulless.png";
    }

    if (value <= 45) {
      return "/images/character/npc_emotionless.png";
    }

    if (value <= 70) {
      return "/images/character/npc_smiling.png";
    }

    return "/images/character/npc_surprise.png";
  };

  /*
   * 강도에 따른 플레이어 표정
   */
  const getPlayerExpression = (value: number) => {
    if (value <= 20) {
      return "/images/character/soulless.png";
    }

    if (value <= 45) {
      return "/images/character/emotionless.png";
    }

    if (value <= 70) {
      return "/images/character/smiling.png";
    }

    return "/images/character/angry.png";
  };

  /*
   * 게임 시작
   */
  const startGame = () => {
    setPower(0);
    setSelectedPower(0);
    setSelectedMenu("");

    // 기본 표정으로 초기화
    setNpcExpression(NPC_DEFAULT);
    setPlayerExpression(PLAYER_DEFAULT);

    setIsIncreasing(true);

    setGameStep("gauge");
  };

  /*
   * 강도 게이지
   */
  useEffect(() => {
    if (gameStep !== "gauge") {
      return;
    }

    const interval = setInterval(() => {
      setPower((prev) => {
        const distanceFromCenter =
          Math.abs(50 - prev);

        const normalized =
          distanceFromCenter / 50;

        const speed =
          8 - normalized * 6;

        let next = isIncreasing
          ? prev + speed
          : prev - speed;

        if (next >= 100) {
          next = 100;
          setIsIncreasing(false);
        }

        if (next <= 0) {
          next = 0;
          setIsIncreasing(true);
        }

        return next;
      });
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, [gameStep, isIncreasing]);

  /*
   * 강도 선택
   *
   * 중요:
   * 게이지가 움직이는 동안에는
   * 캐릭터 표정을 변경하지 않음.
   *
   * 선택 버튼을 누른 순간에만
   * 플레이어 + NPC 표정을 결정.
   */
  const selectPower = () => {
    const powerValue = Math.round(power);

    setSelectedPower(powerValue);

    // NPC 표정 변경
    setNpcExpression(
      getNpcExpression(powerValue)
    );

    // 플레이어 표정 변경
    setPlayerExpression(
      getPlayerExpression(powerValue)
    );

    /*
     * 46~70이면 메뉴 선택 게임
     */
    if (
      powerValue >= 46 &&
      powerValue <= 70
    ) {
      setMenuPosition(0);
      setSelectedMenu("");
      setGameStep("menu");

      return;
    }

    /*
     * 그 외에는 바로 결과
     */
    setGameStep("result");
  };

  /*
   * 메뉴 스크롤
   */
  useEffect(() => {
    if (gameStep !== "menu") {
      return;
    }

    const interval = setInterval(() => {
      setMenuPosition((prev) => {
        const next = prev - 2;

        const totalWidth =
          menus.length * 180;

        if (next <= -totalWidth) {
          return 0;
        }

        return next;
      });
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, [gameStep]);

  /*
   * 메뉴 선택
   */

const selectMenu = () => {
  const itemWidth = 180;

  /*
   * viewport 중앙에 있는 메뉴를 계산
   *
   * 메뉴 하나의 중앙이
   * viewport 중앙선에 들어왔을 때 선택
   */

  const viewportWidth = 700; // 실제 viewport 기준값
  const centerOffset =
    viewportWidth / 2 - itemWidth / 2;

  const position =
    -menuPosition + centerOffset;

  let index =
    Math.round(position / itemWidth) %
    menus.length;

  if (index < 0) {
    index += menus.length;
  }

  const menu = menus[index];

  setSelectedMenu(menu);
  setGameStep("result");
};




  /*
   * 다시 하기
   */
  const resetGame = () => {
    setGameStep("conversation");

    setPower(0);
    setSelectedPower(0);

    setIsIncreasing(true);

    // NPC 기본 표정
    setNpcExpression(NPC_DEFAULT);

    // 플레이어 기본 표정
    setPlayerExpression(PLAYER_DEFAULT);

    setMenuPosition(0);
    setSelectedMenu("");
  };

  /*
   * 결과 문구
   */
  const getResultText = () => {
    if (selectedPower <= 20) {
      return "나: .. 전 따로 먹을게요.";
    }

    if (selectedPower <= 45) {
      return "나: 김치찌개 먹을래요?";
    }

    if (selectedPower <= 70) {
      if (selectedMenu) {
        return `나: ${selectedMenu} 먹을게요.`;
      }

      return "나: 메뉴를 골라볼게요.";
    }

    return "나: 나한테 명령하지마!!!!!!!!!!!!!!!";
  };

  const getResultFontSize = () => {
  if (selectedPower <= 20) {
    return 10;
  }

  if (selectedPower <= 45) {
    return 20;
  }

  if (selectedPower <= 70) {
    return 30;
  }

    return 70;
  };

  return (
    <main className="game">

      {/* =========================
          만년과장 배경
      ========================== */}
      <div className="npc-background">
        <img
          src={npcExpression}
          alt="만년과장"
        />
      </div>

      <div className="game__inner">

        <h1 className="game__title">
          THE HELL
        </h1>

        {/* =========================
            대화창
        ========================== */}
        <div className="dialog">

          {/* 플레이어 얼굴 */}
          <div className="dialog__player">
            <img
              src={playerExpression}
              alt="플레이어"
            />
          </div>

          {/* 대화 내용 */}
          <div className="dialog__content">

            {/* =========================
                처음 대화
            ========================== */}
            {gameStep === "conversation" && (
              <>
                <div className="dialog__name">
                  만년과장
                </div>

                <p className="dialog__text">
                  박인턴이 오늘 점심 뭐 먹을지 정할래?
                </p>

                <button
                  type="button"
                  className="game__button"
                  onClick={startGame}
                >
                  대답하기
                </button>
              </>
            )}

            {/* =========================
                강도 게이지
            ========================== */}
            {gameStep === "gauge" && (
              <>
                <div className="dialog__name">
                  만년과장
                </div>

                <p className="dialog__text">
                  말의 강도를 정하세요
                </p>

                <div className="power">

                  <div className="power__value">
                    {Math.round(power)}
                  </div>

                  <div className="power__bar">

                    <div
                      className="power__fill"
                      style={{
                        width: `${power}%`,
                      }}
                    />

                  </div>

                  <div className="power__range">
                    <span>약하게</span>
                    <span>강하게</span>
                  </div>

                </div>

                <button
                  type="button"
                  className="game__button"
                  onClick={selectPower}
                >
                  선택
                </button>
              </>
            )}

            {/* =========================
                메뉴 선택
            ========================== */}
            {gameStep === "menu" && (
              <>
                <div className="dialog__name">
                  나
                </div>

                <p className="dialog__text">
                  먹고 싶은 메뉴를 선택하세요.
                </p>

                <div className="menu-game">

                  <div className="menu-game__viewport">

                    <div
                      className="menu-game__track"
                      style={{
                        transform:
                          `translateX(${menuPosition}px)`,
                      }}
                    >

                      {[...menus, ...menus].map(
                        (menu, index) => (
                          <div
                            className="menu-game__item"
                            key={`${menu}-${index}`}
                          >
                            {menu}
                          </div>
                        )
                      )}

                    </div>

                    {/* 가운데 선택선 */}
                    <div className="menu-game__center" />

                  </div>

                  <button
                    type="button"
                    className="game__button"
                    onClick={selectMenu}
                  >
                    선택
                  </button>

                </div>
              </>
            )}

            {/* =========================
                결과
            ========================== */}
            {gameStep === "result" && (
              <>
                <div className="dialog__name">
                  나
                </div>

                <p className="dialog__text"
                style={{
                  fontSize: `${getResultFontSize()}px`,
                  fontWeight: selectedPower >= 71 ? 900 : 600,
                }}>
                  {getResultText()}
                </p>

                <button
                  type="button"
                  className="game__button"
                  onClick={resetGame}
                >
                  다시 하기
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

