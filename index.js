import { tweetsData as initialTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

const userHandle = '@Patricia00'
const userProfilePic = `images/patricia.jpg`

let tweetsData = []

if (localStorage.getItem('tweetsData')) {
  retrieveTweetsFromLocalStorage()
} else {
  localStorage.setItem('tweetsData', JSON.stringify(initialTweetsData))
  tweetsData = initialTweetsData
}

document.addEventListener('click', function (e) {
  if (e.target.id === 'tweet-btn') {
    handleTweetBtn()
  } else if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like)
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet)
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply)
  } else if (e.target.dataset.ellipsis) {
    handleEllipsisClick(e.target.dataset.ellipsis)
  } else if (e.target.dataset.delete) {
    handleDeleteClick(e.target.dataset.delete)
  }
})

document.addEventListener('keypress', function (e) {
  if (e.target.dataset.newReply && e.key === 'Enter') {
    handleNewReply(e.target.dataset.newReply, e.target)
  }
})

function handleTweetBtn() {
  const tweetInput = document.getElementById('tweet-input')

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: userHandle,
      profilePic: userProfilePic,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    })
    storeTweetsInLocalStorage()
    render()
    tweetInput.value = ''
  }
}

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId
  })[0]
  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--
  } else {
    targetTweetObj.likes++
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked
  storeTweetsInLocalStorage()
  render()
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId
  })[0]
  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--
  } else {
    targetTweetObj.retweets++
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
  storeTweetsInLocalStorage()
  render()
}

function handleReplyClick(replyId) {
  toggleReplyView(replyId)
}

function toggleReplyView(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleNewReply(replyId, textInput) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return replyId === tweet.uuid
  })[0]

  if (textInput.value) {
    targetTweetObj.replies.push({
      handle: userHandle,
      profilePic: userProfilePic,
      tweetText: textInput.value,
    })
  }
  storeTweetsInLocalStorage()
  render()
  toggleReplyView(replyId)
}

function handleEllipsisClick(tweetId) {
  document.getElementById(`delete-btn-${tweetId}`).classList.toggle('visible')
}

function handleDeleteClick(tweetId) {
  const filteredTweetsData = tweetsData.filter(function (tweet) {
    return tweet.uuid !== tweetId
  })
  tweetsData = filteredTweetsData
  storeTweetsInLocalStorage()
  render()
}

function getFeedHtml() {
  let feedHtml = ''
  tweetsData.forEach(function (tweet) {
    const likedIconClass = tweet.isLiked ? 'liked' : ''
    const retweetedIconClass = tweet.isRetweeted ? 'retweeted' : ''

    let deleteTweetHtml = ''

    if (tweet.handle === userHandle) {
      deleteTweetHtml = `<i class="fa-solid fa-ellipsis-vertical                   ellipsis-icon-tweet"  data-ellipsis="${tweet.uuid}"></i>
                          <span class="delete-btn" id="delete-btn-${tweet.uuid}" data-delete="${tweet.uuid}">
                          <i class="fa-solid fa-trash-can"></i>
                          Delete
                          </span>`
    }

    let repliesHtml = ''

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (tweet) {
        repliesHtml += `<div class="tweet-reply">
                          <div class="tweet-inner">
                              <img src="${tweet.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${tweet.handle}</p>
                                    <p class="tweet-text">${tweet.tweetText}</p>
                                </div>
                            </div>
                        </div>`
      })
    }

    feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">    
            <img src="${tweet.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${tweet.handle}</p>
                <p class="tweet-text">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots"
                        data-reply="${tweet.uuid}"></i>
                        ${tweet.replies.length}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likedIconClass}" 
                        data-like="${tweet.uuid}"></i>
                        ${tweet.likes}
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweetedIconClass}"
                        data-retweet="${tweet.uuid}"></i>
                        ${tweet.retweets}
                    </span>
                </div>   
            </div>
            ${deleteTweetHtml}    
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
          ${repliesHtml}
          <div class="tweet-reply" id='reply-box'>
            <div class="tweet-inner">     
              <img src="${userProfilePic}" class="profile-pic">
                <div>
                    <p class="handle">${userHandle}</p>
                    <input id="new-reply-input" data-new-reply="${tweet.uuid}" placeholder="Tweet your reply"></input>
                </div>
            </div>   
          </div>    
        </div>         
    </div>
    `
  })

  return feedHtml
}

function render() {
  document.getElementById('feed').innerHTML = getFeedHtml()
}

function storeTweetsInLocalStorage() {
  localStorage.setItem('tweetsData', JSON.stringify(tweetsData))
}

function retrieveTweetsFromLocalStorage() {
  tweetsData = JSON.parse(localStorage.getItem('tweetsData'))
}

render()
