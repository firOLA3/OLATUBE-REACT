// src/Components/PlayVideo/PlayVideo.jsx
import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { subscriptionAPI, userAPI, commentAPI, getProfilePictureUrl } from '../../utils/api'

const PlayVideo = ({ videoId }) => {

    // const {videoId} = useParams(); 


    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [userProfile, setUserProfile] = useState({ name: '', profilePictureUrl: '' });
    const [customComments, setCustomComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [postingComment, setPostingComment] = useState(false);

    const fetchVideoData = async () => {
        // video data fetch
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url).then(res => res.json()).then(data => setApiData(data.items[0]))
    }

    const fetchOtherData = async () => {

        //this is for fetching channel data
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelData_url).then(res => res.json()).then(data => setChannelData(data.items[0]))

        //this one is for comment data
        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
        await fetch(comment_url).then(res => res.json()).then(data => setCommentData(data.items))
    }

    const checkSubscriptionStatus = async () => {
        try {
            const data = await subscriptionAPI.getSubscriptions();
            if (data.success) {
                const subscribed = data.subscriptions.some(sub => sub.channelId === apiData.snippet.channelId);
                setIsSubscribed(subscribed);
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    }

    const handleSubscribe = async () => {
        if (!apiData || !channelData) return;

        try {
            const channelDataToSend = {
                channelId: apiData.snippet.channelId,
                channelTitle: apiData.snippet.channelTitle,
                channelThumbnail: channelData.snippet.thumbnails.default.url
            };

            const data = await subscriptionAPI.subscribe(channelDataToSend);
            if (data.success) {
                setIsSubscribed(true);
                
                const currentCount = parseInt(localStorage.getItem('unreadNotifications') || '0');
                localStorage.setItem('unreadNotifications', currentCount + 1);
                // Trigger event to update navbar
                window.dispatchEvent(new Event('subscriptionUpdated'));
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    }

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const data = await userAPI.getProfile();
            if (data.success) {
                setUserProfile({
                    name: data.data.name || 'User',
                    profilePictureUrl: getProfilePictureUrl(data.data.profilePictureUrl)
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    const fetchCustomComments = async () => {
        try {
            setLoadingComments(true);
            const data = await commentAPI.getComments(videoId);
            if (data.success) {
                setCustomComments(data.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    }

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;

        try {
            setPostingComment(true);
            const data = await commentAPI.postComment(videoId, commentText.trim());
            if (data.success) {
                setCommentText('');
                // Refresh comments after posting
                fetchCustomComments();
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setPostingComment(false);
        }
    }

    const handleCommentKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    }

    const handleCancel = () => {
        setCommentText('');
    }

    useEffect(() => {
        fetchVideoData();
        fetchUserProfile();
    }, [videoId])

    useEffect(() => {
        if (apiData) {
            fetchOtherData();
            checkSubscriptionStatus();
            fetchCustomComments();
        }
    }, [apiData])

    return (
        <div className='play-video'>
            {/* <video src={video1} controls autoPlay muted></video> */}
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
            <div className='play-video-info'>
                <p>{apiData ? value_converter(apiData.statistics.viewCount) : "16k"} &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
                <div>
                    <span><img src={like} />{apiData ? value_converter(apiData.statistics.likeCount) : 155}</span>
                    <span><img src={dislike} />0</span>
                    <span><img src={share} />Share</span>
                    <span><img src={save} />Save</span>
                </div>
            </div>
            <hr />
            <div className='publisher'>
                <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} />
                <div>
                    <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                    <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
                </div>
                <button onClick={handleSubscribe} className={isSubscribed ? 'subscribed' : ''}>
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
            </div>
            <div className='vid-description'>
                <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
                <hr />
                <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} comments</h4>

                {/* enter comment input */}
                {localStorage.getItem('token') && (
                    <div className='comment-input'>
                        <img src={userProfile.profilePictureUrl || user_profile} alt="Profile" />
                        <div className='comment-input-content'>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={handleCommentKeyPress}
                                placeholder="Add a comment..."
                                disabled={postingComment}
                            />
                            <div className='comment-buttons'>
                                <button className='cancel-btn' onClick={handleCancel} disabled={postingComment}>Cancel</button>
                                <button className='comment-btn' onClick={handleCommentSubmit} disabled={!commentText.trim() || postingComment}>
                                    {postingComment ? 'Posting...' : 'Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                
                {loadingComments ? (
                    <div className='loading-comments'>Loading comments...</div>
                ) : (
                    customComments.length > 0 && (
                        <div className='custom-comments-section'>
                            <h5>Recent Comments</h5>
                            {customComments.map((comment) => (
                                <div key={comment.id} className='comment'>
                                    <img src={getProfilePictureUrl(comment.user.profilePictureUrl)} alt="Profile" />
                                    <div>
                                        <h3>{comment.user.name} <span>{moment(comment.createdAt).fromNow()}</span></h3>
                                        <p>{comment.text}</p>
                                        <div className='comment-action'>
                                            <img src={like} alt='' />
                                            <span>0</span>
                                            <img src={dislike} alt='' />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                
                {commentData.map((item, index) => {

                    return (
                        <div key={index} className='comment'>
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className='comment-action'>
                                    <img src={like} alt='' />
                                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt='' />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PlayVideo
