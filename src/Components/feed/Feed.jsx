import React, { useEffect, useState } from 'react'
import './Feed.css'
import thumbnail1 from '../../assets/thumbnail1.png'
import thumbnail2 from '../../assets/thumbnail2.png'
import thumbnail3 from '../../assets/thumbnail3.png'
import thumbnail4 from '../../assets/thumbnail4.png'
import thumbnail5 from '../../assets/thumbnail5.png'
import thumbnail6 from '../../assets/thumbnail6.png'
import thumbnail7 from '../../assets/thumbnail7.png'
import thumbnail8 from '../../assets/thumbnail8.png'
import { Link } from 'react-router-dom'
import { API_KEY, value_converter } from '../../data'
import moment from 'moment'

const Feed = ({category, searchQuery, setSearchQuery}) => {

    const [data, setData] = useState([]);


    const fetchData = async () => {
        if (searchQuery) {
            // Search API
            const search_url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(searchQuery)}&type=video&key=${API_KEY}`
            await fetch(search_url).then(response => response.json()).then(data => {
                // Get video details for search results
                const videoIds = data.items.map(item => item.id.videoId).join(',');
                const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
                return fetch(videoDetails_url).then(response => response.json()).then(videoData => setData(videoData.items))
            })
        } else {
            // Popular videos
            const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`
            await fetch(videoList_url).then(response => response.json()).then(data => setData(data.items))
        }
    }
    //    ola you ghast replace the http and get id from category prop

    useEffect(() => {
        fetchData();
    }, [category, searchQuery])


    return (
        <div className='feed'>
            {data.map((item, index)=>{
                return (
                    <Link to={`video/${item.snippet.categoryId}/${item.id}`} className='card'>
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                        <h2>{item.snippet.title}</h2>
                        <h3>{item.snippet.channelTitle}</h3>
                        <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}</p>
                    </Link>
                )
            })}






        </div>
    )
}

export default Feed
