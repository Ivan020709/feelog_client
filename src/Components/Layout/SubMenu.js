import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './SubMenu.css';

function SubMenu() {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const timerRef = useRef(null);

    const handleEnter = (menu) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setOpenMenu(menu);
    };

    const handleLeave = () => {
        timerRef.current = setTimeout(() => setOpenMenu(null), 200);
    };

    return (
        <div className="sub_menu">
            <div className="sub_menu_top">
                <div className="sub_menu_item" onMouseEnter={() => handleEnter(0)} onMouseLeave={handleLeave}>
                    <div className="sub_menu_title">고민상담</div>
                    {openMenu === 0 && <div className="sub_dropdown">
                        <div onClick={() => navigate('/SelectAi')}>대화하기</div>
                        <div onClick={() => navigate('/Diary')}>감정일기</div>
                        <div onClick={() => navigate('/SharedDiary')}>일기공유</div>
                        <div onClick={() => navigate('/itemShop')}>아이템 상점</div>
                    </div>}
                </div>
                <div className="sub_menu_item" onMouseEnter={() => handleEnter(1)} onMouseLeave={handleLeave}>
                    <div className="sub_menu_title" onClick={() => navigate('/myPage')}>마이페이지</div>
                </div>
                <div className="sub_menu_item" onMouseEnter={() => handleEnter(2)} onMouseLeave={handleLeave}>
                    <div className="sub_menu_title">커뮤니티</div>
                    {openMenu === 2 && <div className="sub_dropdown">
                        <div onClick={() => navigate('/ranking')}>친밀도 랭킹</div>
                        <div onClick={() => navigate('/BoardList')}>고민 게시판</div>
                        <div onClick={() => navigate('/InquiryList')}>문의사항</div>
                        <div onClick={() => navigate('/NoticeList')}>공지사항</div>
                    </div>}
                </div>
                <div className="sub_menu_item" onMouseEnter={() => handleEnter(3)} onMouseLeave={handleLeave}>
                    <div className="sub_menu_title">이용안내</div>
                    {openMenu === 3 && <div className="sub_dropdown">
                        <div onClick={() => navigate('/Hellow')}>인사말</div>
                        <div onClick={() => navigate('/Info')}>상담센터</div>
                        <div onClick={() => navigate('/Map')}>위치정보</div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default SubMenu;
