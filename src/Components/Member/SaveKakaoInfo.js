import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import { Cookies } from 'react-cookie'
import axios from 'axios';
import { loginAction } from '../../store/userSlice'

import './SaveKakaoInfo.css';

function SaveKakaoInfo() {

    const navigate = useNavigate();
    //const { snsid } = useParams();
    //const { email } = useParams()

    const { userid } = useParams()
    const [loginUser, setLoginUser] = useState({})

    const [reid, setReid] = useState('');
    const [idCheckResult, setIdCheckResult] = useState('');
    const [msgStyle, setMsgStyle] = useState({ flex: '1' });
    // 프로필
    const [savefilename, setSavefilename] = useState('');
    const [profilePreview, setProfilePreview] = useState('');
    const [imgSrc, setImgSrc] = useState('');

    // 닉네임
    const [nickname, setNickname] = useState('');
    const [renickname, setRenickname] = useState('');
    const [nicknameCheckResult, setNicknameCheckResult] = useState('');
    const [nicknameMsgStyle, setNicknameMsgStyle] = useState({ flex: '1' });

    // 이메일
    const [email, setEmail] = useState('');
    const [emailCheck, setEmailCheck] = useState(false);


    // 비밀번호
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    // 생년월일
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    // 전화번호
    const [phone, setPhone] = useState('');
    const dispatch = useDispatch()
    const cookies = new Cookies()

    const user = useSelector((state) => state.user);

    // 주소
    const [zip_num, setZip_num] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [editcom, setEditcom] = useState('');

    // 주소 모달
    const [isOpen, setIsOpen] = useState(false);

    const modalStyle = {
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: {
            left: '0', right: '0', top: '50%', bottom: 'auto', margin: 'auto',
            width: '500px', height: '450px', padding: '0', overflow: 'hidden',
            transform: 'translateY(-50%)'
        }
    };




    useEffect(
        () => {
            axios.get('/api/member/getLoginUser', { params: { userid } })
                .then((result) => {
                    setLoginUser(result.data.loginUser)
                    if (result.data.loginUser.editcom == 'N') {
                        setEmail(result.data.loginUser.email)
                        setNickname(result.data.loginUser.nickname)
                        setPhone(result.data.loginUser.phone)
                        setAddress1(result.data.loginUser.address1)
                        setAddress2(result.data.loginUser.address2)
                        setAddress3(result.data.loginUser.address3)
                        setZip_num(result.data.loginUser.zip_num)
                    } else {
                        // 서버에서 발급한 accessToken과 refreshToken까지 함께 저장한다.
                        dispatch(loginAction(result.data.loginUser))
                        cookies.set('user', result.data.loginUser, { path: '/' })
                        navigate('/')
                    }
                })
                .catch((err) => { console.error(err) })
        }, []
    )




    function idCheck() {
        if (!email) return alert('이메일를 입력하세요.');
        axios.post('/api/member/emailCheck', null, { params: { email: email } })
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setIdCheckResult('※ 사용 가능한 이메일입니다.');
                    setMsgStyle({ color: 'blue', flex: '1', fontWeight: 'bold', fontSize: '15px' });
                    setReid(email);
                } else {
                    setIdCheckResult('※ 중복되는 이메일입니다.');
                    setMsgStyle({ color: 'red', flex: '1', fontWeight: 'bold', fontSize: '15px' });
                    setReid('');
                }
            })
            .catch((err) => console.error(err));
    }

    function nicknameCheck() {
        if (!nickname.trim()) return alert('닉네임을 입력하세요.');
        axios.post('/api/member/nicknameCheck', null, { params: { nickname: nickname } })
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setNicknameCheckResult('※ 사용 가능한 닉네임입니다.');
                    setNicknameMsgStyle({ color: 'blue', flex: '1', fontWeight: 'bold', fontSize: '15px' });
                    setRenickname(nickname);
                } else {
                    setNicknameCheckResult('※ 중복되는 닉네임입니다.');
                    setNicknameMsgStyle({ color: 'red', flex: '1', fontWeight: 'bold', fontSize: '15px' });
                    setRenickname('');
                }
            })
            .catch((err) => console.error(err));
    }

    function formatPhoneNumber(value) {
        // 숫자만 남기기
        const numbers = value.replace(/\D/g, '');

        // 최대 11자리까지만
        const phone = numbers.substring(0, 11);

        if (phone.length <= 3) {
            return phone;
        }

        if (phone.length <= 7) {
            return `${phone.slice(0, 3)}-${phone.slice(3)}`;
        }

        return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
    }

    function onSubmit() {

        //카카오 가입 시 멤버 수정
        axios.post('/api/member/updateKakaoMember', { userid, email, nickname, zip_num, address1, address2, address3, phone, editcom: 'Y' })
            .then((result) => {
                // 신규 카카오 회원도 토큰이 포함된 회원정보를 저장한다.
                dispatch(loginAction(result.data.loginUser))
                cookies.set('user', result.data.loginUser, { path: '/' })
                alert('카카오 멤버 가입이 완료되었습니다')
                navigate('/')
            })
            .catch((err) => { console.error(err) })
    }


    // 주소 검색
    const completeHandler = (data) => {

        setZip_num(data.zonecode);
        setAddress1(data.address);
        setAddress3(data.buildingName);

        setIsOpen(false);
    };





    return (
        <div className="save-kakao-wrapper">

            {/* 제목 */}
            <h2 className="save-kakao-title">
                회원정보 입력
            </h2>

            <p className="save-kakao-description">
                카카오 로그인에 필요한 추가 정보를 입력해주세요.
            </p>


            <div className="save-kakao-form">

                <div className="save-kakao-box">



                    {/* 이메일 */}
                    <div className="save-kakao-row">

                        <label className="save-kakao-label">
                            이메일
                        </label>
                        <input className="save-kakao-input" type="text" value={email} onChange={(e) => { setEmail(e.currentTarget.value); setReid(''); setIdCheckResult(''); }} placeholder="이메일 형식(예: abc@abc.com)" readOnly />
                    </div>
                    <div><label style={msgStyle}>{idCheckResult}</label></div>


                    {/* 닉네임 */}
                    <div className="save-kakao-row">

                        <label className="save-kakao-label">닉네임</label>
                        <input className="save-kakao-input" type="text" value={nickname} onChange={(e) => { setNickname(e.currentTarget.value); setRenickname(''); setNicknameCheckResult(''); }} placeholder="닉네임을 입력하세요." readOnly />
                    </div>
                    <div><label style={nicknameMsgStyle}>{nicknameCheckResult}</label></div>




                    {/* 전화번호 */}
                    <div className="save-kakao-row">

                        <label className="save-kakao-label">
                            전화번호
                        </label>

                        <input
                            className="save-kakao-input"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                            placeholder="010-XXXX-XXXX"
                            maxLength={13}
                        />

                    </div>


                    {/* 우편번호 */}
                    <div className="save-kakao-row">

                        <label className="save-kakao-label">
                            우편번호
                        </label>

                        <div className="save-kakao-address-area">

                            <input
                                className="save-kakao-input"
                                type="text"
                                value={zip_num}
                                readOnly
                                placeholder="우편번호"
                            />

                            <button
                                type="button"
                                className="save-kakao-address-btn"
                                onClick={() => setIsOpen(true)}
                            >
                                우편번호 검색
                            </button>

                        </div>

                    </div>


                    {/* 주소 */}
                    <div className="save-kakao-row">

                        <label className="save-kakao-label">
                            주소
                        </label>

                        <input
                            className="save-kakao-input"
                            type="text"
                            value={address1}
                            readOnly
                            placeholder="주소 검색을 해주세요."
                        />

                    </div>


                    {/* 상세주소 */}
                    <div className="save-kakao-row">

                        <label className="save-kakao-label">
                            상세주소
                        </label>

                        <input
                            className="save-kakao-input"
                            type="text"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            placeholder="상세주소를 입력하세요."
                        />

                    </div>


                    {/* 주소3 */}
                    <div className="save-kakao-row">

                        <label className="save-kakao-label">
                            주소3
                        </label>

                        <input
                            className="save-kakao-input"
                            type="text"
                            value={address3}
                            readOnly
                        />

                    </div>

                </div>


                {/* 확인 / 취소 */}
                <div className="save-kakao-btn-group">

                    <button
                        type="button"
                        className="save-kakao-submit"
                        onClick={onSubmit}
                    >
                        확인
                    </button>

                    <button
                        type="button"
                        className="save-kakao-cancel"
                        onClick={() => navigate('/')}
                    >
                        취소
                    </button>

                </div>



                <Modal style={modalStyle} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                    <DaumPostcode onComplete={completeHandler} />
                    <button onClick={() => setIsOpen(false)}>CLOSE</button>
                </Modal>
            </div>
        </div>
    );
}

export default SaveKakaoInfo;
