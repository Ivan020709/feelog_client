import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { logoutAction } from '../../store/userSlice';
import { Cookies } from 'react-cookie';
import jaxios from '../../utils/jwtUtil';

import './MyPage.css';

function MyPage() {
    const loginUser = useSelector(state => state.user);

    const navigate = useNavigate();
    const [menu, setMenu] = useState('main');

    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const [nickname, setNickname] = useState('');
    const [renickname, setRenickname] = useState('');
    const [nicknameCheckResult, setNicknameCheckResult] = useState('');
    const [nicknameMsgStyle, setNicknameMsgStyle] = useState({});

    const [savefilename, setSavefilename] = useState('');
    const [imgSrc, setImgSrc] = useState('');

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [zip_num, setZip_num] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const cookies = new Cookies();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);

    const handlePhoneChange = (e) => {

        // 숫자만 남기기
        let value = e.target.value.replace(/[^0-9]/g, '');
        // 최대 11자리
        value = value.substring(0, 11);
        // 하이픈 자동 추가
        if (value.length <= 3) {
            // 010
            value = value;
        } else if (value.length <= 7) {
            // 010-1234
            value =
                value.substring(0, 3) +
                '-' +
                value.substring(3);
        } else {
            // 010-1234-5678
            value =
                value.substring(0, 3) +
                '-' +
                value.substring(3, 7) +
                '-' +
                value.substring(7);
        }
        setPhone(value);
    };


    useEffect(() => {
        if (!loginUser || !loginUser.userid) {
            alert("로그인 후 이용해주세요");
            navigate('/memberLogin');
            return;
        }

        jaxios.get('/api/member/getEmail', {
            params: {
                email: loginUser.email
            }
        })
            .then((result) => {
                console.log('DB에서 받은 member:', result.data.member);
                const member = result.data.member;

                setEmail(member.email || '');
                setNickname(member.nickname || '');
                setRenickname(member.nickname || '');
                setSavefilename(member.savefilename || '');

                if (member.savefilename) {
                    setImgSrc(
                        `http://3.35.4.91/images/${member.savefilename}`
                    );
                } else {
                    setImgSrc('');
                }

                setPhone(member.phone || '');
                setZip_num(member.zip_num || '');
                setAddress1(member.address1 || '');
                setAddress2(member.address2 || '');
                setAddress3(member.address3 || '');
            })
            .catch((err) => {
                console.error(err);
                alert('회원정보를 불러오지 못했습니다.');
            });

        jaxios.get('/api/admin/getAdmin', {
            params: {
                email: loginUser.email
            }
        })
            .then((result) => {

                if (result.data.role === 'ADMIN') {

                    //alert('관리자 페이지로 이동합니다.');
                    navigate('/adminPage');

                }
            })
            .catch((err) => {

                console.error(err);
                alert('role 조회에 실패했습니다.');
                navigate('/');
            });

    }, [loginUser, navigate]);


    const completeHandler = (data) => {
        setZip_num(data.zonecode);
        setAddress1(data.address);
        setAddress3(data.buildingName || '');
        setIsOpen(false);
    };


    function nicknameCheck() {

        if (!nickname.trim()) {
            alert('닉네임을 입력하세요.');
            return;
        }

        if (nickname === loginUser.nickname) {
            setNicknameCheckResult('※ 현재 사용 중인 닉네임입니다.');
            setNicknameMsgStyle({
                color: 'red',
                fontWeight: 'bold'
            });
            setRenickname(nickname);
            return;
        }

        jaxios.post('/api/member/nicknameCheck', null, { params: { nickname } })
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setNicknameCheckResult(
                        '※ 사용 가능한 닉네임입니다.'
                    );
                    setNicknameMsgStyle({
                        color: 'blue',
                        fontWeight: 'bold'
                    });

                    setRenickname(nickname);

                } else {

                    setNicknameCheckResult(
                        '※ 중복되는 닉네임입니다.'
                    );

                    setNicknameMsgStyle({
                        color: 'red',
                        fontWeight: 'bold'
                    });

                    setRenickname('');
                }
            })
            .catch((err) => {
                console.error(err);
                alert('닉네임 중복확인 중 오류가 발생했습니다.');
            });
    }

    function onSubmit() {

        if (!nickname.trim()) {
            alert('닉네임을 입력하세요.');
            return;
        }

        if (renickname !== nickname) {
            alert('닉네임 중복확인을 해주세요.');
            return;
        }
        // 일반 회원이 새 비밀번호를 입력했을 때만 변경 여부를 검사합니다.
        // 두 칸을 비워두면 서버가 기존 비밀번호를 그대로 유지합니다.
        if (loginUser.provider === 'Local' && (pwd || pwdChk)) {
            if (!pwd) return alert('새 비밀번호를 입력하세요.');
            if (!pwdChk) return alert('비밀번호 확인을 입력하세요.');
            if (pwd !== pwdChk) return alert('비밀번호 체크가 일치하지 않습니다.');
        }

        if (!phone.trim()) {
            alert('전화번호를 입력하세요.');
            return;
        }

        const member = {
            email: email,
            pwd: pwd,
            nickname: nickname,
            phone: phone,
            zip_num: zip_num,
            address1: address1,
            address2: address2,
            address3: address3,
            savefilename: savefilename
        };


        jaxios.post('/api/member/updateMember', member)
            .then(() => {
                alert('회원정보가 수정되었습니다.');
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                alert('회원정보 수정 중 오류가 발생했습니다.');
            });
    }
    function deleteMember() {
        if (!window.confirm(
            '회원탈퇴 시 필로그와의 모든 대화가 삭제됩니다.\n탈퇴하시겠습니까?'
        )) {
            return;
        }

        jaxios.delete('/api/member/deleteMember', { params: { email: loginUser.email } })
            .then(() => {
                alert('회원탈퇴가 완료되었습니다')
                navigate('/')
                dispatch(logoutAction())
                cookies.remove('user')
                navigate('/')
            })
            .catch((err) => {
                console.error(err);
                alert('회원탈퇴 중 오류가 발생했습니다.');
            });
    }

    return (

        <div className="mypage-layout">

            {/* =========================
            사이드바
        ========================= */}
            <aside className="mypage-sidebar">

                <div className="mypage-sidebar-title">
                    마이페이지
                </div>

                <div className="mypage-sidebar-menu">

                    <Link
                        to="/mypage"
                        className="mypage-sidebar-item active"
                    >
                        회원정보 수정
                    </Link>

                    <Link to="/paymentHistory" className="mypage-sidebar-item">
                        결제 내역
                    </Link>

                </div>

                <div className="mypage-sidebar-bottom">

                    <button
                        type="button"
                        className="mypage-sidebar-delete"
                        onClick={deleteMember}
                    >
                        회원탈퇴
                    </button>

                </div>

            </aside>


            {/* =========================
            기존 회원정보 수정
        ========================= */}
            <main className="mypage-content">

                <div className="mypage-wrapper">

                    {/* =========================
                제목
            ========================= */}
                    <h2 className="mypage-title">
                        회원정보 수정
                    </h2>


                    {/* =========================
                프로필
            ========================= */}
                    <div className="mypage-profile-area">

                        <div className="mypage-profile-preview">

                            {imgSrc ? (
                                <img
                                    src={imgSrc}
                                    alt="프로필"
                                />
                            ) : (
                                <span>사진</span>
                            )}

                            <label
                                htmlFor="mypage-profile-image"
                                className="mypage-profile-camera"
                            >
                                📷
                            </label>

                        </div>

                        <input
                            id="mypage-profile-image"
                            type="file"
                            accept="image/*"
                            onChange={fileup}
                            style={{ display: 'none' }}
                        />

                    </div>


                    {/* =========================
                회원정보
            ========================= */}
                    <div className="mypage-form">

                        <div className="mypage-box">


                            {/* 닉네임 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    닉네임
                                </label>

                                <input
                                    className="mypage-input"
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => {
                                        setNickname(e.target.value);
                                        setRenickname('');
                                        setNicknameCheckResult('');
                                    }}
                                    placeholder="닉네임을 입력하세요."
                                />

                                <button
                                    className="mypage-check-btn"
                                    onClick={nicknameCheck}
                                >
                                    중복확인
                                </button>

                            </div>

                            {/* 닉네임 확인 메시지 */}
                            <div className="mypage-check-message">
                                <span style={nicknameMsgStyle}>
                                    {nicknameCheckResult}
                                </span>
                            </div>

                            {/* 비번 */}
                            {/* 일반 회원만 비밀번호 표시 */}
                            {loginUser.provider === 'Local' && (
                                <>
                                    {/* 비번 */}
                                    <div className="mypage-row">

                                        <label className="mypage-label">
                                            비밀번호
                                        </label>

                                        <input
                                            className="mypage-input"
                                            type="password"
                                            value={pwd}
                                            onChange={(e) =>
                                                setPwd(e.target.value)
                                            }
                                            placeholder="비밀번호를 입력하세요"
                                        />

                                    </div>

                                    {/* 비번체크 */}
                                    <div className="mypage-row">

                                        <label className="mypage-label">
                                            비밀번호 체크
                                        </label>

                                        <input
                                            className="mypage-input"
                                            type="password"
                                            value={pwdChk}
                                            onChange={(e) =>
                                                setPwdChk(e.target.value)
                                            }
                                            placeholder="비밀번호를 다시 입력하세요"
                                        />

                                    </div>
                                </>
                            )}
                            {/* 전화번호 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    전화번호
                                </label>

                                <input
                                    className="mypage-input"
                                    type="text"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="010-XXXX-XXXX"
                                    inputMode="numeric"
                                    maxLength={13}
                                />


                            </div>


                            {/* 주소 검색 Modal */}
                            <Modal
                                style={{
                                    overlay: {
                                        backgroundColor:
                                            'rgba(0, 0, 0, 0.5)'
                                    },
                                    content: {
                                        left: '0',
                                        right: '0',
                                        top: '50%',
                                        bottom: 'auto',
                                        margin: 'auto',
                                        width: '500px',
                                        height: '420px',
                                        padding: '0',
                                        overflow: 'hidden',
                                        transform:
                                            'translateY(-50%)'
                                    }
                                }}
                                isOpen={isOpen}
                                onRequestClose={() =>
                                    setIsOpen(false)
                                }
                            >

                                <DaumPostcode
                                    onComplete={completeHandler}
                                />

                                <button
                                    onClick={() =>
                                        setIsOpen(false)
                                    }
                                >
                                    CLOSE
                                </button>

                            </Modal>


                            {/* 우편번호 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    우편번호
                                </label>

                                <input
                                    className="mypage-input"
                                    type="text"
                                    value={zip_num}
                                    readOnly
                                />

                                <button
                                    className="mypage-check-btn"
                                    onClick={() =>
                                        setIsOpen(true)
                                    }
                                >
                                    우편번호검색
                                </button>

                            </div>


                            {/* 주소1 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    주소1
                                </label>

                                <input
                                    className="mypage-input"
                                    type="text"
                                    value={address1}
                                    readOnly
                                />

                            </div>


                            {/* 주소2 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    주소2
                                </label>

                                <input
                                    className="mypage-input"
                                    type="text"
                                    value={address2}
                                    onChange={(e) =>
                                        setAddress2(e.target.value)
                                    }
                                    placeholder="상세주소를 입력하세요."
                                />

                            </div>


                            {/* 주소3 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    주소3
                                </label>

                                <input
                                    className="mypage-input"
                                    type="text"
                                    value={address3}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>


                    {/* =========================
                안내
            ========================= */}
                    {/* <div className="mypage-msg">
                ※ 프로필 사진과 닉네임, 연락처 및 주소를 수정할 수 있습니다.
            </div> */}


                    {/* =========================
                버튼
            ========================= */}
                    <div className="mypage-btn-group">

                        <button
                            className="mypage-btn-save"
                            onClick={onSubmit}
                        >
                            수정하기
                        </button>

                        <button
                            className="mypage-btn-cancel"
                            onClick={() => navigate('/')}
                        >
                            취소
                        </button>

                    </div>



                </div>

            </main>

        </div>


    );
}

export default MyPage;
