import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import jaxios from '../../utils/jwtUtil';
import './MemberManagement.css';

function MemberManagement() {

    const [memberList, setMemberList] = useState([]);
    const loginUser = useSelector(state => state.user);

    // 회원 목록 조회
    useEffect(() => {

        if (!loginUser?.email) return;

        jaxios.get('/api/admin/members', {
            params: {
                adminEmail: loginUser.email
            }
        })
            .then((result) => {
                setMemberList(result.data);
            })
            .catch((err) => {
                console.error(err);
                alert('회원 목록을 불러오지 못했습니다. 관리자 권한을 확인해 주세요.');
            });

    }, [loginUser?.email]);


    return (
        <div className="member-management">

            {/* =========================
                회원관리 헤더
            ========================= */}
            <div className="member-management-header">

                <div>
                    <h2 className="member-management-title">
                        회원 관리
                    </h2>

                    <p className="member-management-description">
                        가입 회원 정보를 조회합니다.
                    </p>
                </div>

                <div className="member-management-count">
                    총 <strong>{memberList.length}</strong>명
                </div>

            </div>


            {/* =========================
                회원 목록
            ========================= */}
            <div className="admin-member-table">

                {/* 헤더 */}
                <div className="admin-member-row admin-member-head">

                    <div>번호</div>
                    <div>이름</div>
                    <div>닉네임</div>
                    <div>이메일</div>
                    <div>가입 방식</div>
                    <div>권한</div>
                    <div>가입일</div>

                </div>


                {/* 회원 목록 */}
                {memberList.map((member) => (

                    <div
                        className="admin-member-row"
                        key={member.userid}
                    >

                        <div>
                            {member.userid}
                        </div>

                        <div>
                            {member.name || '-'}
                        </div>

                        <div>
                            {member.nickname || '-'}
                        </div>

                        <div className="member-email">
                            {member.email}
                        </div>

                        <div>
                            {member.provider || 'LOCAL'}
                        </div>

                        <div>
                            <span className={`member-role ${String(member.role || 'USER').toLowerCase()}`}>
                                {member.role || 'USER'}
                            </span>
                        </div>

                        <div>
                            {member.indate
                                ? String(member.indate).substring(0, 10)
                                : '-'
                            }
                        </div>

                    </div>

                ))}


                {/* 회원이 없을 경우 */}
                {memberList.length === 0 && (

                    <div className="member-empty">
                        등록된 회원이 없습니다.
                    </div>

                )}

            </div>

        </div>
    );
}

export default MemberManagement;