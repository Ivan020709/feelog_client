import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import jaxios from '../../utils/jwtUtil'

import './InquiryView.css';

function InquiryView() {

    const navigate = useNavigate();
    const { inquirynum } = useParams();

    // =====================================================
    // 로그인 사용자
    // =====================================================

    const loginUser = useSelector(state => state.user);


    // =====================================================
    // 문의글
    // =====================================================

    const [post, setPost] = useState(null);


    // =====================================================
    // 관리자 여부
    // =====================================================

    const [isAdmin, setIsAdmin] = useState(false);


    // =====================================================
    // 관리자 답변
    // =====================================================

    const [answer, setAnswer] = useState(null);


    // =====================================================
    // 관리자 답변 입력
    // =====================================================

    const [adminAnswer, setAdminAnswer] = useState('');


    // =====================================================
    // 문의글 작성자 확인
    //
    // 백엔드에서 userid / userId / user_id 중
    // 어떤 이름으로 내려와도 대응
    // =====================================================

    const writerId =
        post?.member?.userid ||
        post?.member?.userId ||
        post?.member?.user_id ||
        post?.userid ||
        post?.userId ||
        post?.user_id;


    const currentUserId =
        loginUser?.userid ||
        loginUser?.userId ||
        loginUser?.user_id;


    const isWriter =
        currentUserId &&
        writerId &&
        String(currentUserId) === String(writerId);


    // =====================================================
    // 문의글 조회
    // =====================================================

    useEffect(() => {

        axios.get(`/api/inquiry/getInquiry/${inquirynum}`)
            .then((result) => {

                console.log(
                    '문의글:',
                    result.data.inquiry
                );

                setPost(
                    result.data.inquiry
                );

            })
            .catch((err) => {

                console.error(
                    '문의글 조회 실패:',
                    err
                );

                alert(
                    '문의글을 불러오지 못했습니다.'
                );

                navigate('/InquiryList');

            });

    }, [inquirynum, navigate]);


    // =====================================================
    // 작성자 확인 디버깅
    // =====================================================

    useEffect(() => {

        if (!post) {
            return;
        }

        console.log(
            '로그인 사용자 ID:',
            currentUserId
        );

        console.log(
            '문의글 작성자 ID:',
            writerId
        );

        console.log(
            '작성자 여부:',
            isWriter
        );

    }, [
        post,
        currentUserId,
        writerId,
        isWriter
    ]);


    // =====================================================
    // 관리자 여부 조회
    // =====================================================

    useEffect(() => {

        if (!loginUser?.email) {

            setIsAdmin(false);

            return;
        }


        jaxios.get(
            '/api/admin/getAdmin',
            {
                params: {
                    email: loginUser.email
                }
            }
        )
            .then((result) => {

                console.log(
                    '관리자 권한:',
                    result.data.role
                );

                setIsAdmin(
                    result.data.role === 'ADMIN'
                );

            })
            .catch((err) => {

                console.error(
                    'role 조회 실패:',
                    err
                );

                setIsAdmin(false);

            });

    }, [loginUser?.email]);


    // =====================================================
    // 관리자 답변 조회
    // =====================================================

    useEffect(() => {

        if (!inquirynum) {
            return;
        }


        axios.get(
            '/api/admin/getAdminAnswer',
            {
                params: {
                    inquiryId: inquirynum
                }
            }
        )
            .then((result) => {

                console.log(
                    '관리자 답변:',
                    result.data.answers
                );


                // 답변 하나만 저장
                setAnswer(
                    result.data.answers || null
                );

            })
            .catch((err) => {

                console.error(
                    '관리자 답변 조회 실패:',
                    err
                );

                setAnswer(null);

            });

    }, [inquirynum]);


    // =====================================================
    // 관리자 답변 등록
    // =====================================================

    const handleAdminAnswerSubmit = (e) => {

        e.preventDefault();


        // 관리자 확인
        if (!isAdmin) {

            alert(
                '관리자만 답변을 작성할 수 있습니다.'
            );

            return;
        }


        // 빈 답변 확인
        if (!adminAnswer.trim()) {

            alert(
                '답변을 입력해주세요.'
            );

            return;
        }


        jaxios.post(
            '/api/admin/writeAnswer',
            null,
            {
                params: {
                    inquirynum: inquirynum,
                    nickname: loginUser.nickname,
                    content: adminAnswer.trim(),
                }
            }
        )
            .then((result) => {

                // 서버가 실제로 DB에 저장한 답변을 받아 화면에 표시합니다.
                setAnswer(result.data.answer);


                setAdminAnswer('');


                // 문의글 상태도 화면에서 바로 변경
                setPost((prev) => ({

                    ...prev,

                    status: '답변완료'

                }));


                alert(
                    '관리자 답변이 등록되었습니다.'
                );

            })
            .catch((err) => {

                console.error(
                    '관리자 답변 등록 실패:',
                    err
                );

                alert(
                    '관리자 답변 등록에 실패했습니다.'
                );

            });

    };


    // =====================================================
    // 문의글 삭제
    // =====================================================

    const handleDelete = () => {

        // 작성자가 아닌 경우
        if (!isWriter) {

            alert(
                '작성자만 삭제할 수 있습니다.'
            );

            return;
        }


        if (
            !window.confirm(
                '문의를 삭제하시겠습니까?'
            )
        ) {

            return;
        }


        jaxios.delete(
            `/api/inquiry/deleteInquiry/${inquirynum}`
        )
            .then((result) => {

                if (
                    result.data.msg === 'OK'
                ) {

                    alert(
                        '문의가 삭제되었습니다.'
                    );

                    navigate('/InquiryList');

                } else {

                    alert(
                        '문의 삭제에 실패했습니다.'
                    );

                }

            })
            .catch((err) => {

                console.error(
                    '문의 삭제 실패:',
                    err
                );

                alert(
                    '문의 삭제 중 오류가 발생했습니다.'
                );

            });

    };


    // =====================================================
    // 로딩
    // =====================================================

    if (!post) {

        return (

            <div className="inquiry-view-page">

                <div className="inquiry-view-loading">

                    문의글을 불러오는 중입니다...

                </div>

            </div>

        );

    }


    // =====================================================
    // 화면
    // =====================================================

    return (

        <div className="inquiry-view-page">


            {/* =================================================
                상단 헤더
            ================================================= */}

            <div className="inquiry-view-header">

                <button
                    type="button"
                    className="inquiry-view-back"
                    onClick={() =>
                        navigate('/InquiryList')
                    }
                >
                    ← 목록
                </button>


                <h1 className="inquiry-view-heading">

                    문의 상세 내용

                </h1>

            </div>


            {/* =================================================
                문의글
            ================================================= */}

            <div className="inquiry-view-card">

                <div className="inquiry-view-title-area">

                    <h2 className="inquiry-view-title">

                        {post.title}

                    </h2>

                </div>


                <div className="inquiry-view-info">

                    <span className="inquiry-view-writer">

                        작성자 :
                        <strong>
                            {post.member?.nickname ||
                                "알 수 없는 사용자"}
                        </strong>

                    </span>


                    <span className="inquiry-view-date">

                        작성일 :
                        {post.indate?.substring(0, 10)}

                    </span>


                    {/* 문의 상태 */}

                    <span
                        className={
                            post.status === '답변완료'
                                ? 'inquiry-status-complete'
                                : ''
                        }
                    >

                        {post.status === '답변완료'
                            ? '답변 완료'
                            : ''}

                    </span>

                </div>


                <div className="inquiry-view-content">

                    {post.content}

                </div>

            </div>


            {/* =================================================
    하단 버튼
================================================= */}

            <div className="inquiry-view-actions">

                {/* 목록 버튼은 항상 표시 */}
                <button
                    type="button"
                    className="inquiry-view-list-btn"
                    onClick={() => navigate('/InquiryList')}
                >
                    목록으로
                </button>


                {/* =================================================
        작성자이고 아직 관리자 답변이 없는 경우에만
        수정 / 삭제 버튼 표시
    ================================================= */}

                {isWriter && !answer && (

                    <div className="inquiry-view-action-group">

                        <button
                            type="button"
                            className="inquiry-view-edit-btn"
                            onClick={() =>
                                navigate(`/UpdateInquiry/${inquirynum}`)
                            }
                        >
                            수정
                        </button>


                        <button
                            type="button"
                            className="inquiry-view-delete-btn"
                            onClick={handleDelete}
                        >
                            삭제
                        </button>

                    </div>

                )}

            </div>

            {/* =================================================
                관리자 답변 영역
            ================================================= */}

            <div className="inquiry-admin-answer-section">


                {/* 답변 제목 */}

                <div className="inquiry-admin-answer-title">

                    관리자 답변

                </div>


                {/* =================================================
                    답변이 있는 경우
                ================================================= */}

                {answer ? (

                    <div className="inquiry-admin-answer">

                        <div className="inquiry-admin-answer-header">

                            <div className="inquiry-admin-answer-user">

                                <span className="inquiry-admin-answer-avatar">

                                    {
                                        answer.nickname?.charAt(0) ||
                                        'A'
                                    }

                                </span>


                                <strong>

                                    {answer.nickname}

                                </strong>


                                <span className="inquiry-admin-answer-date">

                                    {(answer.indate || answer.createdAt)?.substring(0, 10)}

                                </span>

                            </div>

                        </div>


                        {/* 답변 내용 */}

                        <div className="inquiry-admin-answer-content">

                            {answer.content}

                        </div>

                    </div>

                ) : (

                    <div className="inquiry-admin-no-answer">

                        아직 관리자 답변이 없습니다.

                    </div>

                )}


                {/* =================================================
                    관리자만 답변 작성
                ================================================= */}

                {isAdmin && !answer && (

                    <form
                        className="inquiry-admin-answer-form"
                        onSubmit={
                            handleAdminAnswerSubmit
                        }
                    >

                        <textarea
                            value={adminAnswer}
                            onChange={(e) =>
                                setAdminAnswer(
                                    e.target.value
                                )
                            }
                            placeholder="문의에 대한 답변을 입력해주세요."
                        />


                        <button type="submit">

                            답변 등록

                        </button>

                    </form>

                )}

            </div>

        </div>

    );

}


export default InquiryView;
