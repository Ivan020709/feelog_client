import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';

import './Join.css';

function Join() {

    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    /* =========================================================
       회원 정보
    ========================================================= */

    const [email, setEmail] = useState('');
    const [reid, setReid] = useState('');
    const [idCheckResult, setIdCheckResult] = useState('');

    // 이메일로 받은 인증번호를 입력받기 위한 상태값
    const [usercode, setUsercode] = useState('');

    // 이메일 인증 완료 여부
    const [emailConfirm, setEmailConfirm] = useState(false);

    const [msgStyle, setMsgStyle] = useState({
        flex: '1'
    });

    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const [name, setName] = useState('');

    const [nickname, setNickname] = useState('');
    const [renickname, setRenickname] = useState('');
    const [nicknameCheckResult, setNicknameCheckResult] = useState('');

    const [nicknameMsgStyle, setNicknameMsgStyle] = useState({
        flex: '1'
    });

    const [savefilename, setSavefilename] = useState('');
    const [imgSrc, setImgSrc] = useState('');

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    const [phone, setPhone] = useState('');

    const [zip_num, setZip_num] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');

    const [isOpen, setIsOpen] = useState(false);

    const cookies = new Cookies();

    /* =========================================================
       이메일 형식 검사
    ========================================================= */
    const emailRegex =
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    /* =========================================================
       주소 검색 Modal
    ========================================================= */

    const modalStyle = {
        overlay: {
            backgroundColor: 'rgba(79, 73, 68, 0.45)',
            zIndex: 1000
        },
        content: {
            left: '0',
            right: '0',
            top: '50%',
            bottom: 'auto',
            margin: 'auto',

            width: '500px',
            height: '500px',

            padding: '0',

            overflow: 'hidden',

            transform: 'translateY(-50%)',

            border: '1px solid #f0e5df',
            borderRadius: '20px',

            background: '#fffdfb',

            boxShadow:
                '0 18px 45px rgba(80, 65, 55, 0.18)'
        }
    };

    /* =========================================================
       로그인 상태 확인
    ========================================================= */

    useEffect(() => {
        if (loginUser && loginUser.email) {
            navigate('/');
        }
    }, [loginUser, navigate]);


    /* =========================================================
       다음 주소 검색 완료
    ========================================================= */

    const completeHandler = (data) => {
        setZip_num(data.zonecode);
        setAddress1(data.address);
        setAddress3(data.buildingName);
        setIsOpen(false);
    };


    /* =========================================================
       이메일 입력
    ========================================================= */
    function handleEmailChange(e) {
        const value = e.currentTarget.value;
        setEmail(value);
        /*
         * 이메일을 수정하면
         * 기존 중복확인 결과를 무효화
         */
        setReid('');
        setIdCheckResult('');

        // 이메일이 바뀌면 이전에 입력했던 인증번호도 지웁니다.
        setUsercode('');
        setEmailConfirm(false);
        setMsgStyle({
            flex: '1'
        });
    }

    /* =========================================================
       이메일 인증번호 확인

       현재는 화면의 기본 틀만 만든 상태입니다.
       나중에 이 함수 안에서 서버의 인증번호 확인 API를 호출하면 됩니다.
    ========================================================= */


    function onConfirm() {
        if (!usercode) {
            return alert('인증코드를 입력하세요.');
        }

        axios.post('/api/member/conFirmCode', null, {
            params: {
                email: email.trim(),
                usercode: usercode
            }
        })
            .then((result) => {
                if (result.data.msg === 'ok') {
                    // 인증 성공 상태 저장
                    setEmailConfirm(true);
                    alert('인증 완료되었습니다.');
                } else {
                    // 인증번호가 틀리면 인증 실패 상태
                    setEmailConfirm(false);
                    alert('입력한 코드가 일치하지 않습니다.');
                }
            })
            .catch((err) => {
                console.error(err);
                setEmailConfirm(false);
                alert('인증번호 확인 중 오류가 발생했습니다.');
            });
    }

    /* =========================================================
       이메일 중복 확인
    ========================================================= */
    async function idCheck() {
        const checkEmail = email.trim();

        // 인증번호를 다시 발급하면 이전 인증 결과를 무효화
        setEmailConfirm(false);

        if (!checkEmail) {
            return alert(
                '이메일을 입력하세요.'
            );
        }
        /*
         * 이메일 형식 검사
         */

        if (!emailRegex.test(checkEmail)) {
            return alert(
                '올바른 이메일 형식으로 입력하세요.'
            );
        }
        document.getElementById('sendBtn').disabled = true
        try {
            const result = await axios.post('/api/member/emailCheck', null, { params: { email: checkEmail } })
            if (result.data.msg === 'OK') {
                setIdCheckResult('※ 사용 가능한 이메일입니다.');
                setMsgStyle({ color: '#b68b78', flex: '1', fontWeight: '700' });

                /*중복확인 완료된 이메일 저장*/
                setReid(checkEmail);
                alert('이메일이 전송되었습니다. 해당 이메일 수신내역을 확인하세요')
            } else {
                setIdCheckResult('※ 중복되는 이메일입니다.');
                setMsgStyle({ color: '#c47b70', flex: '1', fontWeight: '700' });
                setReid('');
            }
        } catch (err) {
            console.error(err);
            alert('이메일 중복 확인 중 오류가 발생했습니다.');
        } finally {
            document.getElementById('sendBtn').disabled = false
        }
    }
    /* =========================================================
       닉네임 입력
    ========================================================= */
    function handleNicknameChange(e) {
        const value =
            e.currentTarget.value;
        setNickname(value);
        setRenickname('');
        setNicknameCheckResult('');
        setNicknameMsgStyle({ flex: '1' });
    }
    /* =========================================================
       닉네임 중복 확인
    ========================================================= */
    function nicknameCheck() {
        const checkNickname = nickname.trim();
        if (!checkNickname) {
            return alert('닉네임을 입력하세요.');
        }
        axios.post('/api/member/nicknameCheck', null, { params: { nickname: checkNickname } }
        )
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setNicknameCheckResult('※ 사용 가능한 닉네임입니다.');
                    setNicknameMsgStyle({ color: '#b68b78', flex: '1', fontWeight: '700' });
                    setRenickname(checkNickname);
                } else {
                    setNicknameCheckResult('※ 중복되는 닉네임입니다.');
                    setNicknameMsgStyle({ color: '#c47b70', flex: '1', fontWeight: '700' });
                    setRenickname('');
                }
            })
            .catch((err) => {
                console.error(err);
                alert('닉네임 중복 확인 중 오류가 발생했습니다.');
            });
    }
    /* =========================================================
       프로필 이미지 업로드
    ========================================================= */
    // function fileup(e) {
    //     const file = e.target.files[0];
    //     if (!file) { return; }
    //     if (!file.type.startsWith('image/')) {
    //         alert('이미지 파일만 선택할 수 있습니다.');
    //         e.target.value = '';
    //         return;
    //     }
    //     const formData = new FormData();
    //     formData.append('image', file);
    //     axios.post('/api/member/fileupload', formData)
    //         .then((result) => {
    //             setSavefilename(result.data.savefilename);
    //             setImgSrc(
    //                 `http://3.35.4.91/images/${result.data.savefilename}`
    //             );
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             alert('프로필 사진 업로드 중 오류가 발생했습니다..');
    //         });
    // }
    function fileup(e) {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 선택할 수 있습니다.');
            e.target.value = '';
            return;
        }

        // 파일 선택 즉시 미리보기
        setImgSrc(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('image', file);

        axios.post('/api/member/fileupload', formData)
            .then((result) => {
                setSavefilename(result.data.savefilename);
            })
            .catch((err) => {
                console.error(err);
                alert('프로필 사진 업로드 중 오류가 발생했습니다.');
            });
    }
    /* =========================================================
       전화번호
    ========================================================= */
    function handlePhoneChange(e) {
        let value = e.currentTarget.value
            .replace(/\D/g, '')
            .slice(0, 11);
        if (
            value.length > 3 &&
            value.length <= 7
        ) {
            value = `${value.slice(0, 3)}-${value.slice(3)}`;
        } else if (
            value.length > 7
        ) {
            value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
        }
        setPhone(value);
    }
    /* =========================================================
       회원가입
    ========================================================= */
    function onSubmit() {
        const checkEmail = email.trim();
        /* -----------------------------------------
           이메일
        ----------------------------------------- */
        if (!checkEmail) {
            return alert('이메일을 입력하세요.');
        }
        /** 이메일 형식 검사*/
        if (!emailRegex.test(checkEmail)) {
            return alert('올바른 이메일 형식으로 입력하세요.');
        }
        /*이메일 중복확인 여부*/
        if (reid !== checkEmail) {
            return alert('이메일 중복을 확인해주세요.');
        }
        if (!emailConfirm) {
            return alert('이메일 본인인증을 완료해주세요.');
        }
        /* -----------------------------------------
           비밀번호
        ----------------------------------------- */
        if (!pwd) {
            return alert('비밀번호를 입력하세요.');
        }
        if (pwd !== pwdChk) {
            return alert('비밀번호 체크가 일치하지 않습니다.');
        }
        /* -----------------------------------------
           이름
        ----------------------------------------- */
        if (!name.trim()) {
            return alert('이름을 입력하세요.');
        }
        /* -----------------------------------------
           닉네임
        ----------------------------------------- */
        const checkNickname = nickname.trim();
        if (!checkNickname) {
            return alert('닉네임을 입력하세요.');
        }
        if (renickname !== checkNickname) {
            return alert('닉네임 중복을 확인해주세요.');
        }
        /* -----------------------------------------
           생년월일
        ----------------------------------------- */
        // if (!year || !month || !day) {
        //     return alert(
        //         '생년월일을 입력하세요.'
        //     );
        // }
        // if (
        //     isNaN(year) ||
        //     isNaN(month) ||
        //     isNaN(day) ||

        //     Number(year) < 1901 ||
        //     Number(year) > 2026 ||

        //     Number(month) < 1 ||
        //     Number(month) > 12 ||

        //     Number(day) < 1 ||
        //     Number(day) > 31
        // ) {

        //     return alert(
        //         '올바른 생년월일을 입력하세요.'
        //     );
        // }
        /*
         * 실제 존재하는 날짜인지 확인
         */

        // const date =
        //     new Date(
        //         Number(year),
        //         Number(month) - 1,
        //         Number(day)
        //     );


        // if (
        //     date.getFullYear() !== Number(year) ||
        //     date.getMonth() !== Number(month) - 1 ||
        //     date.getDate() !== Number(day)
        // ) {

        //     return alert(
        //         '존재하지 않는 날짜입니다.'
        //     );
        // }
        /* -----------------------------------------
           전화번호
        ----------------------------------------- */
        if (!phone) { return alert('번호를 입력하세요.'); }
        /* -----------------------------------------
           주소
        ----------------------------------------- */
        if (zip_num === '') { return alert('우편번호를 입력하세요.'); }
        if (!address1) { return alert('주소를 입력하세요.'); }

        /* -----------------------------------------
           생년월일 생성
        ----------------------------------------- */
        // const birth =
        //     `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        /* -----------------------------------------
           회원가입 요청
        ----------------------------------------- */
        axios.post(
            '/api/member/insertMember',
            {
                email: checkEmail,
                pwd: pwd,
                name: name.trim(),
                nickname: checkNickname,
                // birth: birth,
                phone: phone,
                zip_num: zip_num,
                address1: address1,
                address2: address2,
                address3: address3,
                savefilename: savefilename,
                provider: 'Local'
            }
        )
            .then(() => {
                alert(
                    '회원 가입이 완료되었습니다.'
                );
                cookies.remove(
                    'user',
                    {
                        path: '/'
                    }
                );
                navigate(
                    '/memberLogin'
                );
            })
            .catch((err) => {
                console.error(err);
                alert(
                    '회원가입 중 오류가 발생했습니다.'
                );
            });
    }
    /* =========================================================
       화면
    ========================================================= */
    return (
        <div className="join-wrapper">
            {/* 제목 */}
            <h2 className="join-title">회원 가입</h2>
            {/* 프로필 */}
            <div className="profile-area">
                <div className="profile-preview">
                    {imgSrc ? (
                        <img
                            src={imgSrc}
                            alt="프로필 미리보기"
                        />
                    ) : (
                        <span>사진</span>
                    )}
                    <label
                        htmlFor="profile-image"
                        className="profile-camera-btn"
                    >
                        📷
                    </label>
                </div>
                <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={fileup}
                    style={{
                        display: 'none'
                    }}
                />
            </div>
            {/* 회원가입 폼 */}
            <div className="join-form">
                <div className="join-box">
                    {/* 이메일 */}
                    <div className="join-row">
                        <label className="join-label">이메일</label>
                        <input
                            className="join-input-id"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="이메일 형식(예: abc@abc.com)"
                            autoComplete="email"
                        />
                        <button
                            type="button"
                            className="join-btn-zip_num"
                            onClick={idCheck}
                            id='sendBtn'
                        >
                            중복확인
                        </button>
                    </div>
                    {/* 이메일 메시지 */}
                    <div className="join-check-message">
                        <label style={msgStyle}>
                            {idCheckResult}
                        </label>
                    </div>
                    {/* 이메일 인증번호 */}
                    <div className="join-row join-code-row">
                        <label className="join-label">인증번호</label>
                        <input
                            className="join-input-code"
                            type="text"
                            value={usercode}
                            onChange={(e) =>
                                setUsercode(e.currentTarget.value)
                            }
                            placeholder="이메일로 받은 인증번호를 입력하세요."
                        />
                        <button
                            type="button"
                            className="join-btn-code"
                            onClick={onConfirm}
                        >
                            확인
                        </button>
                    </div>
                    {/* 비밀번호 */}
                    <div className="join-row">
                        <label className="join-label">비밀번호</label>
                        <input
                            className="join-input-etc"
                            type="password"
                            value={pwd}
                            onChange={(e) =>
                                setPwd(
                                    e.currentTarget.value
                                )
                            }
                            placeholder="비밀번호를 입력하세요."
                            autoComplete="new-password"
                        />
                    </div>
                    {/* 비밀번호 확인 */}
                    <div className="join-row">
                        <label className="join-label">비밀번호 체크</label>
                        <input
                            className="join-input-etc"
                            type="password"
                            value={pwdChk}
                            onChange={(e) =>
                                setPwdChk(
                                    e.currentTarget.value
                                )
                            }
                            placeholder="비밀번호를 다시 입력하세요."
                            autoComplete="new-password"
                        />
                    </div>
                    {/* 이름 */}
                    <div className="join-row">
                        <label className="join-label">이름</label>
                        <input
                            className="join-input-etc"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.currentTarget.value
                                )
                            }
                            placeholder="이름을 입력하세요."
                            autoComplete="name"
                        />
                    </div>
                    {/* 닉네임 */}
                    <div className="join-row">
                        <label className="join-label">닉네임</label>
                        <input
                            className="join-input-id"
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            placeholder="닉네임을 입력하세요."
                        />
                        <button
                            type="button"
                            className="join-btn-zip_num"
                            onClick={nicknameCheck}
                        >
                            중복확인
                        </button>
                    </div>
                    {/* 닉네임 메시지 */}
                    <div className="join-check-message">
                        <label style={nicknameMsgStyle}>{nicknameCheckResult}</label>
                    </div>
                    {/* 생년월일 */}
                    {/* <div className="join-row">
                        <label className="join-label">생년월일</label>
                        <input
                            className="join-input-four"
                            type="text"
                            inputMode="numeric"
                            placeholder="YYYY"
                            maxLength="4"
                            value={year}
                            onChange={(e) =>
                                setYear(
                                    e.currentTarget.value
                                )
                            }
                        />
                        <label className="join-label-birth">년</label>
                        <input
                            className="join-input-two"
                            type="text"
                            inputMode="numeric"
                            placeholder="MM"
                            maxLength="2"
                            value={month}
                            onChange={(e) =>
                                setMonth(
                                    e.currentTarget.value
                                )
                            }
                        />
                        <label className="join-label-birth">월</label>
                        <input
                            className="join-input-two"
                            type="text"
                            inputMode="numeric"
                            placeholder="DD"
                            maxLength="2"
                            value={day}
                            onChange={(e) =>
                                setDay(
                                    e.currentTarget.value
                                )
                            }
                        />
                        <label className="join-label-birth">일</label>
                    </div> */}
                    {/* 전화번호 */}
                    <div className="join-row">
                        <label className="join-label">전화번호</label>
                        <input
                            className="join-input-etc"
                            type="text"
                            inputMode="numeric"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="010-XXXX-XXXX"
                            maxLength="13"
                        />
                    </div>
                    {/* 주소 검색 Modal */}
                    <Modal
                        style={modalStyle}
                        isOpen={isOpen}
                        onRequestClose={() =>
                            setIsOpen(false)
                        }
                        ariaHideApp={false}
                    >

                        <DaumPostcode
                            onComplete={completeHandler}
                        />
                        <button
                            type="button"
                            className="join-modal-close"
                            onClick={() =>
                                setIsOpen(false)
                            }
                        >
                            CLOSE
                        </button>
                    </Modal>
                    {/* 우편번호 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">우편번호</label>
                            <input
                                className="join-input"
                                type="text"
                                value={zip_num}
                                readOnly
                            />
                            <button
                                type="button"
                                className="join-btn-zip_num"
                                onClick={() =>
                                    setIsOpen(true)
                                }
                            >
                                우편번호검색
                            </button>
                        </div>
                    </div>
                    {/* 주소1 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소1</label>
                            <input
                                className="join-input-etc"
                                type="text"
                                value={address1}
                                readOnly
                            />
                        </div>
                    </div>
                    {/* 주소2 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소2</label>
                            <input
                                className="join-input-etc"
                                type="text"
                                value={address2}
                                onChange={(e) =>
                                    setAddress2(
                                        e.currentTarget.value
                                    )
                                }
                                placeholder="상세주소를 입력하세요."
                            />
                        </div>
                    </div>
                    {/* 주소3 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소3</label>
                            <input
                                className="join-input-etc"
                                type="text"
                                value={address3}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* 안내 문구 */}
            <div className="join_msg">※ 가입 후 아이디 변경 불가</div>
            {/* 버튼 */}
            <div className="join-btn-group">
                <button
                    type="button"
                    className="join-action-btn join-btn-join"
                    onClick={onSubmit}
                >
                    확인
                </button>
                <button
                    type="button"
                    className="join-action-btn join-btn-cancel"
                    onClick={() =>
                        navigate('/')
                    }
                >
                    취소
                </button>
            </div>
            <hr />
        </div>
    );
}

export default Join;
