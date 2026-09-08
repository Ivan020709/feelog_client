import React from "react";

import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate()
    return (
        <footer className="footer">
            <div className="footer-inner">

                <div className="footer-top">

                    {/* 로고 / 사이트 소개 */}
                    <div className="footer-brand">
                        <div className="footer-logo" onClick={() => navigate('/role')}>
                            필<span>로그</span>
                        </div>

                        <p>
                            혼자 간직했던 마음을<br />
                            편하게 꺼내놓을 수 있는 공간
                        </p>
                    </div>

                    {/* 메뉴 */}
                    <div className="footer-menu">
                        <div className="footer-menu-title">서비스</div>
                        <a href="/SelectAi">대화하기</a>
                        <a href="/diary">감정일기</a>
                        <a href="/SharedDiary">일기공유</a>
                        <a href="/BoardList">고민 게시판</a>
                    </div>

                    {/* 안내 */}
                    <div className="footer-menu">
                        <div className="footer-menu-title">이용안내</div>
                        <a href="/Hellow">인사말</a>
                        <a href="/Map">위치정보</a>
                        <a href="/NoticeList">공지사항</a>
                    </div>

                    {/* 메시지 */}
                    <div className="footer-message">
                        <div className="footer-message-icon">♡</div>
                        <p>
                            오늘 하루도<br />
                            당신의 마음이 조금은<br />
                            가벼워지기를 바랍니다.
                        </p>
                    </div>

                </div>

                <div className="footer-bottom">
                    <div>
                        © 2026 필로그. All rights reserved.
                    </div>

                    <div className="footer-bottom-info">
                        <span>AI 감정상담 서비스</span>
                        <span>.</span>
                        <span>Contact : support@example.com</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;