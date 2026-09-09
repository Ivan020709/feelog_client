import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import './Main.css';

import characterHero from "../../Img/필로그1.png";
import characterRecommend from "../../Img/필로그2.png";
import characterBottom from "../../Img/필로그3.png";

function Main() {
    const navigate = useNavigate();
    const loginUser = useSelector((state) => state.user);

    // Feelog 시작하기
    const handleStart = () => {
        if (loginUser && loginUser.userid) {
            navigate("/selectAi");
        } else {
            navigate("/memberLogin");
        }
    };

    

    return (
        <main className="main-page">

            {/* =====================================================
                1. 메인 Hero 영역
            ===================================================== */}
            <section className="main-hero">

                <div className="main-hero-text">

                    <span className="main-hero-badge">
                        💗 FEEL + LOG
                    </span>

                    <h1>
                        오늘의 마음을<br />
                        <strong>Feelog</strong>에 기록해요
                    </h1>

                    <p>
                        AI와 편하게 대화하며<br />
                        나의 감정을 이해하고 하루를 돌아보는 시간
                    </p>

                    <button
                        type="button"
                        onClick={handleStart}
                    >
                        Feelog 시작하기 <span>→</span>
                    </button>

                </div>


                <div className="main-hero-character">

                    <div className="main-heart">
                        ♥
                    </div>

                    <img
                        src={characterHero}
                        alt="Feelog 캐릭터"
                    />

                </div>

            </section>


            {/* =====================================================
                2. Feelog 소개
            ===================================================== */}
            <section className="main-section">

                <div className="main-section-title">

                    <span>💗</span>

                    <div>
                        <small>ABOUT FEELLOG</small>

                        <h2>
                            마음을 말하면,<br />
                            기록이 됩니다.
                        </h2>
                    </div>

                </div>


                <div className="main-about-box">

                    <p>
                        매일 일기를 쓰는 것이 어렵게 느껴지셨나요?
                    </p>

                    <p>
                        Feelog는 AI와 자연스럽게 대화하며
                        오늘의 감정과 생각을 기록할 수 있는
                        감정 일기 서비스입니다.
                    </p>

                    <p>
                        무슨 말을 써야 할지 고민하지 않아도 괜찮아요.<br />
                        편하게 이야기를 나누는 것만으로
                        나의 하루가 하나의 소중한 기록이 됩니다.
                    </p>

                </div>

            </section>


            {/* =====================================================
                3. Feelog 주요 기능
            ===================================================== */}
            <section className="main-section main-features">

                <div className="main-section-heading">

                    <small>WHAT WE OFFER</small>

                    <h2>
                        Feelog가 함께할게요
                    </h2>

                    <p>
                        나의 마음을 이해하고 기록하는 데 필요한
                        기능을 한곳에 담았습니다.
                    </p>

                </div>


                <div className="main-feature-grid">

                    <article className="main-feature-card">

                        <div className="main-feature-icon">
                            💬
                        </div>

                        <h3>
                            AI 감정 대화
                        </h3>

                        <p>
                            오늘 있었던 일을 AI에게 편하게 이야기하며
                            자연스럽게 감정을 표현해보세요.
                        </p>

                    </article>


                    <article className="main-feature-card">

                        <div className="main-feature-icon">
                            📝
                        </div>

                        <h3>
                            감정일기 자동 정리
                        </h3>

                        <p>
                            대화 속 이야기를 바탕으로 오늘의 감정과
                            하루를 하나의 일기로 정리해줍니다.
                        </p>

                    </article>


                    <article className="main-feature-card">

                        <div className="main-feature-icon">
                            😊
                        </div>

                        <h3>
                            오늘의 감정 선택
                        </h3>

                        <p>
                            오늘 나의 대표 감정을 선택하고
                            간단하게 하루의 마음을 기록할 수 있어요.
                        </p>

                    </article>


                    <article className="main-feature-card">

                        <div className="main-feature-icon">
                            📅
                        </div>

                        <h3>
                            감정 캘린더
                        </h3>

                        <p>
                            날짜별 감정을 모아보며 시간이 지나면서
                            변화하는 나의 마음을 확인해보세요.
                        </p>

                    </article>


                    <article className="main-feature-card">

                        <div className="main-feature-icon">
                            🔍
                        </div>

                        <h3>
                            과거 일기 검색
                        </h3>

                        <p>
                            키워드를 통해 예전에 기록했던 감정일기를
                            쉽고 빠르게 찾아볼 수 있어요.
                        </p>

                    </article>

                </div>

            </section>


            {/* =====================================================
                4. Feelog 이용 방법
            ===================================================== */}
            <section className="main-section main-process">

                <div className="main-section-heading">

                    <small>HOW IT WORKS</small>

                    <h2>
                        네 단계로 시작하는<br />
                        나만의 감정 기록
                    </h2>

                </div>


                <div className="main-process-grid">

                    <div className="main-process-item">

                        <span>01</span>

                        <h3>
                            AI와 대화하기
                        </h3>

                        <p>
                            오늘 있었던 일을<br />
                            편하게 이야기해요.
                        </p>

                    </div>


                    <div className="main-process-arrow">
                        →
                    </div>


                    <div className="main-process-item">

                        <span>02</span>

                        <h3>
                            감정 표현하기
                        </h3>

                        <p>
                            대화를 통해<br />
                            나의 마음을 표현해요.
                        </p>

                    </div>


                    <div className="main-process-arrow">
                        →
                    </div>


                    <div className="main-process-item">

                        <span>03</span>

                        <h3>
                            AI가 정리해줘요
                        </h3>

                        <p>
                            대화 속 감정과 이야기를<br />
                            일기로 정리해줘요.
                        </p>

                    </div>


                    <div className="main-process-arrow">
                        →
                    </div>


                    <div className="main-process-item">

                        <span>04</span>

                        <h3>
                            감정일기 저장
                        </h3>

                        <p>
                            오늘의 나를<br />
                            소중하게 기록해요.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                5. Feelog 추천 대상
            ===================================================== */}
            <section className="main-recommend">

                <div>

                    <small>
                        FOR YOU
                    </small>

                    <h2>
                        이런 분께<br />
                        Feelog를 추천해요
                    </h2>

                    <ul>

                        <li>
                            내 감정을 표현하는 것이 어려운 분
                        </li>

                        <li>
                            하루를 차분하게 돌아보고 싶은 분
                        </li>

                        <li>
                            꾸준히 감정일기를 쓰고 싶은 분
                        </li>

                        <li>
                            나의 감정 변화를 알고 싶은 분
                        </li>

                    </ul>

                </div>


                <div className="main-recommend-character">

                    <img
                        src={characterRecommend}
                        alt="Feelog 캐릭터"
                    />

                    <div className="main-character-heart">
                        ♥
                    </div>

                </div>

            </section>


            {/* =====================================================
                6. 마지막 Feelog 시작하기 영역
            ===================================================== */}
            <section className="main-bottom">

                <img
                    src={characterBottom}
                    alt="Feelog 캐릭터"
                />


                <div className="main-bottom-content">

                    <span>
                        오늘의 작은 대화가
                    </span>

                    <strong>
                        내일의 나를 더 따뜻하게 만들어줘요.
                    </strong>

                    <button
                        type="button"
                        onClick={handleStart}
                    >
                        Feelog 시작하기 <span>→</span>
                    </button>

                </div>

            </section>

        </main>
    );
}

export default Main;