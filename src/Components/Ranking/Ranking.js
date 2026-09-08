import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import './Ranking.css';

function Ranking() {
    const [character, setCharacter] = useState('필');
    const [rows, setRows] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const loadMoreRef = useRef(null);

    // 로그인하지 않은 회원도 전체 랭킹은 볼 수 있습니다.
    // 로그인한 경우에만 쿠키의 회원번호를 이용해 내 순위를 찾습니다.
    const loginUser = new Cookies().get('user');
    const myRanking = rows.find(row => Number(row.userId) === Number(loginUser?.userid));

    useEffect(() => {
        axios.get('/api/affinity/ranking', { params: { character: character } })
            .then(result => {
                setRows(result.data.ranking || []);
                // 다른 AI 탭으로 이동하면 다시 첫 10명부터 보여줍니다.
                setVisibleCount(10);
            })
            .catch(error => console.error(error));
    }, [character]);

    useEffect(() => {
        // 이미 모든 순위를 보여준 경우에는 더 이상 감지할 필요가 없습니다.
        if (visibleCount >= rows.length) return;

        // 목록 맨 아래의 감지 영역이 화면에 보이면 다음 10명을 추가합니다.
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisibleCount(count => Math.min(count + 10, rows.length));
            }
        }, {
            // 사용자의 실제 브라우저 세로 길이를 기준으로 판단합니다.
            // 하단 감지 영역 전체가 화면 안에 들어와야 다음 10개를 불러옵니다.
            root: null,
            // 화면 끝에 닿는 즉시 실행하지 않고 300px 정도 더 내려야 실행됩니다.
            rootMargin: '0px 0px -300px 0px',
            threshold: 1.0
        });

        const target = loadMoreRef.current;
        if (target) observer.observe(target);

        return () => observer.disconnect();
        // 10개가 추가될 때마다 새 위치의 하단 영역을 다시 관찰합니다.
    }, [rows.length, visibleCount]);

    return (
        <main className="ranking-page">
            <h1>AI 친밀도 랭킹</h1>
            <p>AI별로 가장 가까워진 사용자를 확인해 보세요.</p>
            <div className="ranking-tabs">
                {['필', '로', '그'].map(name => (
                    <button key={name} className={character === name ? 'active' : ''}
                        onClick={() => setCharacter(name)}>{name} 랭킹</button>
                ))}
            </div>

            {loginUser && (
                <div className="my-ranking-box">
                    <span>나의 {character} 친밀도 순위</span>
                    {myRanking ? (
                        <>
                            <strong>{myRanking.rank}등</strong>
                            <em>Lv.{myRanking.level} · {myRanking.exp} EXP</em>
                        </>
                    ) : (
                        <strong>순위 없음</strong>
                    )}
                </div>
            )}

            <div className="ranking-list">
                {rows.slice(0, visibleCount).map(row => <div className={`ranking-row rank-${row.rank}`} key={row.userId}>
                    <b className="ranking-number">{row.rank}</b>
                    <div className="ranking-profile">
                        {row.savefilename ? <img src={`/api/images/${row.savefilename}`} alt="" /> : <span>🙂</span>}
                        <strong>{row.nickname}</strong>
                    </div>
                    <span>Lv.{row.level} {row.levelName}</span>
                    <em>{row.exp} EXP</em>
                </div>)}
            </div>

            {/* 이 영역이 보일 때 다음 10개가 자동으로 표시됩니다. */}
            <div className="ranking-load-more" ref={loadMoreRef}>
                {visibleCount < rows.length ? '다음 순위를 불러오는 중...' : '마지막 순위입니다.'}
            </div>
        </main>
    );
}

export default Ranking;
