import React, { useCallback, useEffect, useRef, useState } from 'react';
import Navpane from '../Components/Navpane';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import usePostSearch from './usePostSearch'
import Post from '../Components/Post'
import Loading from '../Components/Loading'

function Home(props) {
    const [pageNumber, setPageNumber] = useState(1)
    const {isVerified} = useSelector(state => state.userReducer)
    const navigate = useNavigate()

    const {
        posts,
        hasMore,
        loading,
        error,
        errorMsg
      } = usePostSearch(pageNumber)

    const observer = useRef()
    const lastPostRef = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    if(!localStorage.getItem('myTkn')){
        return(
            <Navigate to='/' />
        )
    }else if(isVerified == 0) {
        return(
            <Navigate to='/unconfirmed' />
        )
    }

    return (
        <div className='d-flex'>
            <Navpane />
            <div className='page-container'>
            
            {
                posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return <div ref={lastPostRef} key={post.id}>
                           <Post post={post} pageNumber={pageNumber} />
                        </div>
                    } else {
                        return <div key={post.id}>
                            <Post post={post} pageNumber={pageNumber} />
                        </div>
                    }
                })
            }
                <div>{loading && < Loading />}</div>
                <div>{error && `${errorMsg}`}</div>
            </div>
        </div>
    );
}

export default Home;