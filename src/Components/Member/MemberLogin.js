import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { loginAction } from '../../store/userSlice';

import './MemberLogin.css';

function MemberLogin() {

    // =====================================================
    // Redux 로그인 사용자
    // =====================================================

    const loginUser = useSelector(state => state.user);


    // =====================================================
    // 로그인 입력값
    // =====================================================

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [msg, setMsg] = useState('');


    // =====================================================
    // 기본 설정
    // =====================================================

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const returnPath =
        location.state?.from || '/';

    const cookies = new Cookies();


    // =====================================================
    // 로그인 상태가 변경되면 이동
    // =====================================================

    useEffect(() => {

        if (loginUser && loginUser.userid) {

            navigate(
                returnPath,
                {
                    replace: true
                }
            );

        }

    }, [
        loginUser,
        navigate,
        returnPath
    ]);


    // =====================================================
    // 로그인
    // =====================================================

    function onSubmit() {

        // 아이디 검사
        if (!userid) {

            alert('아이디를 입력하세요.');

            return;

        }


        // 비밀번호 검사
        if (!pwd) {

            alert('비밀번호를 입력하세요.');

            return;

        }


        // 메시지 초기화
        setMsg('');


        // =================================================
        // 로그인 요청
        // =================================================

        axios.post(
            '/api/member/login',
            null,
            {
                params: {
                    userid: userid,
                    pwd: pwd
                }
            }
        )

            .then((result) => {

                console.log(
                    '================================='
                );

                console.log(
                    '로그인 성공'
                );

                console.log(
                    '로그인 데이터 :',
                    result.data
                );

                console.log(
                    'accessToken :',
                    result.data.accessToken
                );

                console.log(
                    'refreshToken :',
                    result.data.refreshToken
                );

                console.log(
                    '================================='
                );


                // =================================================
                // 토큰 존재 여부 확인
                // =================================================

                if (!result.data.accessToken) {

                    console.error(
                        'accessToken이 없습니다.'
                    );

                    alert(
                        '로그인에 성공했지만 Access Token을 받지 못했습니다.'
                    );

                    return;

                }


                if (!result.data.refreshToken) {

                    console.error(
                        'refreshToken이 없습니다.'
                    );

                    alert(
                        '로그인에 성공했지만 Refresh Token을 받지 못했습니다.'
                    );

                    return;

                }


                // =================================================
                // Redux 저장
                // =================================================

                dispatch(
                    loginAction(result.data)
                );


                // =================================================
                // Cookie 저장
                //
                // JSON.stringify() 하지 않고 객체 자체를 저장
                // =================================================

                cookies.set(
                    'user',
                    result.data,
                    {
                        path: '/'
                    }
                );


                // =================================================
                // 저장 확인
                // =================================================

                const savedUser =
                    cookies.get('user');

                console.log(
                    '================================='
                );

                console.log(
                    '쿠키 저장 확인'
                );

                console.log(
                    'savedUser :',
                    savedUser
                );

                console.log(
                    'saved accessToken :',
                    savedUser?.accessToken
                );

                console.log(
                    'saved refreshToken :',
                    savedUser?.refreshToken
                );

                console.log(
                    '================================='
                );


                // =================================================
                // 메인 페이지 이동
                // =================================================

                navigate(
                    returnPath,
                    {
                        replace: true
                    }
                );

            })

            .catch((err) => {

                console.error(
                    '로그인 실패:',
                    err
                );

                setMsg(
                    '아이디 또는 비밀번호가 올바르지 않습니다.'
                );

            });

    }


    // =====================================================
    // 화면
    // =====================================================

    return (

        <div>

            <div className="login-wrapper">

                <h2 className="login-title">
                    로그인
                </h2>


                <div className="login-form">

                    <div className="login-box">

                        <div className="login-row">

                            <label className="login-label">
                                ID
                            </label>

                            <input
                                className="login-input"
                                type="text"
                                value={userid}
                                onChange={(e) =>
                                    setUserid(
                                        e.currentTarget.value
                                    )
                                }
                                placeholder="아이디를 입력해주세요."
                            />

                        </div>


                        <div className="login-row">

                            <label className="login-label">
                                PW
                            </label>

                            <input
                                className="login-input"
                                type="password"
                                value={pwd}
                                onChange={(e) =>
                                    setPwd(
                                        e.currentTarget.value
                                    )
                                }
                                placeholder="비밀번호를 입력해주세요."
                            />

                        </div>

                    </div>


                    <button
                        className="btn-login"
                        onClick={onSubmit}
                    >
                        확인
                    </button>

                </div>


                <label className="login-msg">
                    {msg}
                </label>


                <div className="login-extra">

                    <button
                        className="btn-kakao"
                        onClick={() =>
                            navigate('/join')
                        }
                    >
                        회원 가입
                    </button>


                    <button
                        className="btn-find"
                        onClick={() =>
                            navigate('/find')
                        }
                    >
                        아이디/비밀번호 찾기
                    </button>

                </div>


                <div className="login-footer">

                    <button
                        className="btn-join"
                        onClick={() =>
                            window.location.href =
                            '/api/member/kakaostart'
                        }
                    >
                        KAKAO
                    </button>

                </div>

            </div>

        </div>

    );

}

export default MemberLogin;