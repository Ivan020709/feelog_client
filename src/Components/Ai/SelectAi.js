import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import jaxios from "../../utils/jwtUtil";

import "./SelectAi.css";

import ai1 from "../../Img/필필.png";
import ai2 from "../../Img/로로.png";
import ai3 from "../../Img/그그.png";


function SelectAi() {

    const navigate = useNavigate();
    const loginUser = new Cookies().get("user");
    const [levels, setLevels] = useState({ 필: 1, 로: 1, 그: 1 });

    useEffect(() => {
        if (!loginUser?.userid) return;

        // AI마다 친밀도가 따로 저장되므로 세 모델의 정보를 각각 조회합니다.
        Promise.all(
            ["필", "로", "그"].map(character =>
                jaxios.get("/api/affinity/myInfo", {
                    params: { userId: loginUser.userid, character: character }
                })
            )
        )
            .then(results => {
                setLevels({
                    필: results[0].data.level,
                    로: results[1].data.level,
                    그: results[2].data.level
                });
            })
            .catch(error => console.error("AI 친밀도 조회 실패:", error));
    }, [loginUser?.userid]);


    // =====================================================
    // AI 선택
    // =====================================================

    const handleFeel = () => {
        navigate("/feel");
    };


    const handleLo = () => {
        navigate("/lo");
    };


    const handleG = () => {
        navigate("/g");
    };


    return (

        <div className="select-ai">

            {/* =================================================
                AI 선택 영역
            ================================================= */}

            <div className="select-ai-container">


                {/* =================================================
                    필
                ================================================= */}

                <div
                    className="ai-card"
                    onClick={handleFeel}
                >

                    <div className="ai-image-box">

                        <img
                            src={ai1}
                            alt="필"
                            className="ai-image"
                        />

                    </div>


                    <div className="ai-info">

                        <h3>
                            필
                        </h3>

                        <p>
                            편안하게 이야기를 들어주는
                            <br />
                            따뜻한 AI입니다.
                        </p>

                    </div>


                    <div className="ai-example">

                        <div className="example-user">
                            나 오늘 너무 힘들었어...
                        </div>

                        <div className="example-ai">
                            무슨 일이 있었어? 괜찮아.
                            <br />
                            천천히 이야기해도 괜찮아.
                        </div>

                    </div>

                    <div className="ai-affinity-level">친밀도 Lv.{levels.필}</div>

                </div>


                {/* =================================================
                    로
                ================================================= */}

                <div
                    className="ai-card"
                    onClick={handleLo}
                >

                    <div className="ai-image-box">

                        <img
                            src={ai2}
                            alt="로"
                            className="ai-image"
                        />

                    </div>


                    <div className="ai-info">

                        <h3>
                            로
                        </h3>

                        <p>
                            즐겁고 밝은 분위기로
                            <br />
                            대화할 수 있는 AI입니다.
                        </p>

                    </div>


                    <div className="ai-example">

                        <div className="example-user">
                            오늘 재미있는 일이 있었어!
                        </div>

                        <div className="example-ai">
                            정말?
                            <br />
                            무슨 일인데?
                            나한테도 이야기해줘!
                        </div>

                    </div>

                    <div className="ai-affinity-level">친밀도 Lv.{levels.로}</div>

                </div>


                {/* =================================================
                    그
                ================================================= */}

                <div
                    className="ai-card"
                    onClick={handleG}
                >

                    <div className="ai-image-box">

                        <img
                            src={ai3}
                            alt="그"
                            className="ai-image"
                        />

                    </div>


                    <div className="ai-info">

                        <h3>
                            그
                        </h3>

                        <p>
                            차분하게 고민을 나누고
                            <br />
                            함께 생각해주는 AI입니다.
                        </p>

                    </div>


                    <div className="ai-example">

                        <div className="example-user">
                            요즘 고민이 하나 있어.
                        </div>

                        <div className="example-ai">
                            괜찮아.
                            <br />
                            서두르지 말고 천천히 이야기해봐.
                        </div>

                    </div>

                    <div className="ai-affinity-level">친밀도 Lv.{levels.그}</div>

                </div>

            </div>

        </div>

    );
}

export default SelectAi;
