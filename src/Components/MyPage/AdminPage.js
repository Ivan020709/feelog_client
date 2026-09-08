import React, { useEffect, useState } from 'react';
import ErrorLog from './ErrorLog';
import './AdminPage.css';
import jaxios from '../../utils/jwtUtil';
import { useNavigate } from 'react-router-dom';
import AdminActivityLog from './AdminActivityLog';
import MemberManagement from './MemberManagement';
import { useSelector } from 'react-redux';

function AdminPage() {

    const [menu, setMenu] = useState('report');
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportList, setReportList] = useState([]);
    const [paging, setPaging] = useState({})
    const [pages, setPages] = useState(1);

    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);

    const ROWS_PER_PAGE = 10;

    const totalPages = Math.ceil(
        (paging?.totalCount ?? 0) / ROWS_PER_PAGE
    );

    const startPage = Math.floor((pages - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);


    // 신고 목록
    useEffect(() => {
        jaxios.get('/api/admin/getReportList', {
            params: {
                page: pages
            }
        })
            .then((result) => {
                setReportList([...result.data.reportList]);
                setPaging(result.data.paging);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [pages]);


    // 페이지 이동
    const handlePage = (pageNumber) => {

        if (pageNumber < 1 || pageNumber > totalPages) {
            return;
        }

        setPages(pageNumber);
    };


    function deleteReport() {

        const result = window.confirm(
            '신고된 게시물을 삭제하시겠습니까?'
        );

        if (!result) {
            return;
        }

        jaxios.delete('/api/admin/deleteReport', {
            params: {
                reportnum: selectedReport.reportnum,
                adminid: loginUser.userid,
                adminname: loginUser.name,
                boardnum: selectedReport.boardnum
            }
        })
            .then(() => {
                alert('삭제되었습니다.');
                navigate('/myPage');
            })
            .catch((err) => {
                console.error(err);
                alert('삭제에 실패했습니다.');
            });
    }


    return (
        <div className="admin-layout">

            <div className="admin-page">

                {/* =========================
                    관리자 사이드바
                ========================= */}
                <aside className="admin-sidebar">

                    <div className="admin-sidebar-title">
                        관리자 페이지
                    </div>


                    <div className="admin-sidebar-menu">

                        {/* 신고함 */}
                        <button
                            type="button"
                            className={`admin-sidebar-item ${menu === 'report' ? 'active' : ''
                                }`}
                            onClick={() => setMenu('report')}
                        >
                            신고함
                        </button>


                        {/* 에러 로그 */}
                        <button
                            type="button"
                            className={`admin-sidebar-error ${menu === 'error' ? 'active' : ''
                                }`}
                            onClick={() => setMenu('error')}
                        >
                            에러 로그
                        </button>


                        {/* 관리자 활동 로그 */}
                        <button
                            type="button"
                            className={`admin-sidebar-adminLog ${menu === 'activity' ? 'active' : ''
                                }`}
                            onClick={() => setMenu('activity')}
                        >
                            관리자 활동 로그
                        </button>


                        {/* 회원관리 */}
                        <button
                            type="button"
                            className={`admin-sidebar-item ${menu === 'member' ? 'active' : ''
                                }`}
                            onClick={() => setMenu('member')}
                        >
                            회원 관리
                        </button>

                    </div>

                </aside>


                {/* =========================
                    메인
                ========================= */}
                <main className="admin-content">

                    <div className="admin-wrapper">


                        {/* =========================
                            신고함
                        ========================= */}
                        {menu === 'report' && (

                            <>

                                <div className="admin-header">

                                    <div>

                                        <h2 className="admin-title">
                                            신고함
                                        </h2>

                                        <p className="admin-description">
                                            접수된 신고 내역을 확인하고 관리합니다.
                                        </p>

                                    </div>

                                    <div className="admin-count">
                                        총 <strong>{reportList.length}</strong>건
                                    </div>

                                </div>


                                {/* 신고 게시판 */}
                                <div className="admin-board">

                                    <div className="admin-board-header">

                                        <div>번호</div>
                                        <div>신고 유형</div>
                                        <div>신고 대상</div>
                                        <div>신고 내용</div>
                                        <div>신고자</div>
                                        <div>신고일</div>

                                    </div>


                                    {reportList.map((report) => (

                                        <React.Fragment
                                            key={report.reportnum}
                                        >

                                            {/* 신고 목록 */}
                                            <div
                                                className={`admin-board-row ${selectedReport?.reportnum ===
                                                    report.reportnum
                                                    ? 'selected'
                                                    : ''
                                                    }`}
                                                onClick={() =>
                                                    setSelectedReport(
                                                        selectedReport?.reportnum ===
                                                            report.reportnum
                                                            ? null
                                                            : report
                                                    )
                                                }
                                            >

                                                <div className="report-num">
                                                    {report.reportnum}
                                                </div>

                                                <div>
                                                    <div className="report-type">
                                                        {report.reasontype}
                                                    </div>
                                                </div>

                                                <div>
                                                    {report.criminal}
                                                </div>

                                                <div className="report-content">
                                                    {report.content}
                                                </div>

                                                <div>
                                                    {report.reporter}
                                                </div>

                                                <div>
                                                    {report.indate.substring(0, 10)}
                                                </div>

                                            </div>


                                            {/* 신고 상세 */}
                                            {selectedReport?.reportnum ===
                                                report.reportnum && (

                                                    <div className="report-detail">

                                                        <div className="report-detail-title">
                                                            신고 상세
                                                        </div>


                                                        <div className="report-detail-info">

                                                            <div className="report-detail-item">

                                                                <div className="report-detail-label">
                                                                    신고 유형
                                                                </div>

                                                                <div className="report-detail-value">
                                                                    {report.reasontype}
                                                                </div>

                                                            </div>


                                                            <div className="report-detail-item">

                                                                <div className="report-detail-label">
                                                                    신고 대상
                                                                </div>

                                                                <div className="report-detail-value">
                                                                    {report.criminal}
                                                                </div>

                                                            </div>


                                                            <div className="report-detail-item">

                                                                <div className="report-detail-label">
                                                                    신고자
                                                                </div>

                                                                <div className="report-detail-value">
                                                                    {report.reporter}
                                                                </div>

                                                            </div>


                                                            <div className="report-detail-item">

                                                                <div className="report-detail-label">
                                                                    신고일
                                                                </div>

                                                                <div className="report-detail-value">
                                                                    {report.indate.substring(0, 10)}
                                                                </div>

                                                            </div>

                                                        </div>


                                                        <div className="report-detail-content">

                                                            <div className="report-detail-label">
                                                                신고 내용
                                                            </div>

                                                            <div className="report-detail-text">
                                                                {report.content}
                                                            </div>

                                                        </div>


                                                        {report.status !== '처리완료' && (

                                                            <button
                                                                type="button"
                                                                className="report-delete-button"
                                                                onClick={deleteReport}
                                                            >
                                                                삭제
                                                            </button>

                                                        )}

                                                    </div>

                                                )}

                                        </React.Fragment>

                                    ))}

                                </div>


                                {/* 페이지네이션 */}
                                {totalPages > 1 && (

                                    <div className="admin-pagination">

                                        {/* 이전 */}
                                        {startPage > 1 && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePage(startPage - 1)
                                                }
                                            >
                                                &lt;
                                            </button>

                                        )}


                                        {/* 페이지 번호 */}
                                        {Array.from(
                                            {
                                                length:
                                                    endPage -
                                                    startPage +
                                                    1
                                            },
                                            (_, index) =>
                                                startPage + index
                                        ).map((pageNumber) => (

                                            <button
                                                type="button"
                                                key={pageNumber}
                                                className={
                                                    pages === pageNumber
                                                        ? 'active'
                                                        : ''
                                                }
                                                onClick={() =>
                                                    handlePage(pageNumber)
                                                }
                                            >
                                                {pageNumber}
                                            </button>

                                        ))}


                                        {/* 다음 */}
                                        {endPage < totalPages && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePage(endPage + 1)
                                                }
                                            >
                                                &gt;
                                            </button>

                                        )}

                                    </div>

                                )}

                            </>

                        )}


                        {/* =========================
                            에러 로그
                        ========================= */}
                        {menu === 'error' && (
                            <ErrorLog />
                        )}


                        {/* =========================
                            관리자 활동 로그
                        ========================= */}
                        {menu === 'activity' && (
                            <AdminActivityLog />
                        )}


                        {/* =========================
                            회원 관리
                        ========================= */}
                        {menu === 'member' && (
                            <MemberManagement />
                        )}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default AdminPage;