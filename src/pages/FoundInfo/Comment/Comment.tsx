import React from 'react'
import { View, Text, StyleSheet, Image, PixelRatio, TouchableOpacity } from 'react-native'
import pxToDp from '../../../utils/px2dp'
import { Colors } from '../../../constants/Theme'
import { AntDesign } from '@expo/vector-icons'
import { apiGiveLaud } from '../../../service/api'
import moment from 'moment'

const likeIcon = require('../../../assets/works-image/like.png')
const notLikeIcon = require('../../../assets/works-image/not_like.png')

interface Props {
  isLogin: boolean;
  commentCount: number;
  commentInfoList: Array<any>;
  toReply(item: any): void;
  toggleCommentCount(): void;
  giveLaud(commentInfo: any): void;
  toggleReplyCount(id: string): void;
}

export default function Comment(props: Props) {
  const { commentInfoList, commentCount, isLogin } = props

  const formatDate = (time: number) => {
    const curYear = new Date().getFullYear()
    const commentYear = new Date(time).getFullYear()

    return moment(time).format(commentYear <= curYear ? 'MM-DD' : 'YY-MM-DD')
  }

  const giveLaud = (commentInfo: any) => {
    if (!isLogin) return

    const { commentId, isLike } = commentInfo

    const params = {
      giveLaudId: commentId,
      operateType: isLike ? 1 : 0,
      type: 'COMMENT'
    }

    apiGiveLaud(params).then((res: any) => {
      console.log('点赞评论', res)
      if (res) {
        props.giveLaud(commentInfo)
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.totalCount}>
        <Text>共{commentCount}条评论</Text>
        <AntDesign name='caretdown' size={10} />
      </View>

      {
        commentInfoList && commentInfoList.map((item: any, index: number) => {
          return (
            <View key={`comment-${index}`} style={[
              styles.commentItem,
              index === commentInfoList.length - 1 && { borderBottomWidth: 0 }
            ]}>
              <TouchableOpacity onPress={() => props.toReply(item)}>
                <Image source={{ uri: item.userIcon }} style={styles.avatar} />
              </TouchableOpacity>

              <View style={styles.commentInfoList}>
                <TouchableOpacity onPress={() => props.toReply(item)}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={[styles.content, { marginBottom: pxToDp(10) }]}>{item.content}    <Text style={styles.commentDate}>{formatDate(item.commentTime)}</Text></Text>
                </TouchableOpacity>

                {
                  item.showReplyInfoList && item.showReplyInfoList.map((_item: any, _index: number) => {
                    return (
                      <View key={`replay-${_index}`} style={{ flexDirection: 'row', marginBottom: pxToDp(20) }}>
                        <Image source={{ uri: _item.fromIdUserIcon }} style={styles.avatar} />
                        <View style={styles.commentInfoList}>
                          <Text style={styles.userName}>{_item.fromIdUserName}</Text>
                          <Text style={styles.content}>
                            <Text style={styles.content}>回复</Text>
                            <Text style={[styles.content, styles.userName]}>@{_item.toIdUserName}:
                            </Text>{_item.content}    <Text style={styles.commentDate}>{formatDate(_item.createTime)}</Text>
                          </Text>
                        </View>
                      </View>
                    )
                  })
                }

                {
                  item.totalReplyCount > 2 && <TouchableOpacity
                    style={styles.getMore}
                    onPress={() => props.toggleReplyCount(item.commentId)}
                  >
                    <Text style={styles.getMoreText}>{
                      item.totalReplyCount === (item.showReplyInfoList && item.showReplyInfoList.length)
                        ? `收起回复`
                        : `展开${item.totalReplyCount - (item.showReplyInfoList && item.showReplyInfoList.length)}条回复`
                    }</Text>
                    <AntDesign name={
                      item.totalReplyCount === (item.showReplyInfoList && item.showReplyInfoList.length)
                        ? 'up'
                        : 'down'
                    } size={18} color='#347CFF' />
                  </TouchableOpacity>
                }
              </View>

              <TouchableOpacity style={styles.likeContent} onPress={() => giveLaud(item)}>
                <Image source={item.isLike ? likeIcon : notLikeIcon} style={styles.likeIcon} />
                <Text style={styles.likeCount}>{item.getLaudCount}</Text>
              </TouchableOpacity>
            </View>
          )
        })
      }

      {
        commentInfoList && commentInfoList.length >= 5
        && <TouchableOpacity style={styles.getMore} onPress={() => props.toggleCommentCount()}>
          <Text style={styles.getMoreText}>{commentCount === commentInfoList.length ? '收起评论' : `展开${commentCount - commentInfoList.length}条评论`}</Text>
          <AntDesign name={commentCount === commentInfoList.length ? 'up' : 'down'} size={18} color='#347CFF' />
        </TouchableOpacity>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: pxToDp(10),
    backgroundColor: Colors.whiteColor
  },
  totalCount: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: pxToDp(20),
    paddingLeft: pxToDp(20),
    marginBottom: pxToDp(20)
  },
  commentItem: {
    flexDirection: 'row',
    padding: pxToDp(20),
    paddingRight: 0,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: Colors.borderColor
  },
  avatar: {
    width: pxToDp(60),
    height: pxToDp(60),
    borderRadius: pxToDp(30)
  },
  commentInfoList: {
    flex: 1,
    marginLeft: pxToDp(14)
  },
  likeIcon: {
    width: pxToDp(28),
    height: pxToDp(28)
  },
  likeContent: {
    width: pxToDp(80),
    alignItems: 'center'
  },
  likeCount: {
    fontSize: pxToDp(22),
    color: Colors.darkBlack
  },
  getMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: pxToDp(20)
  },
  getMoreText: {
    fontSize: pxToDp(28),
    color: '#347CFF',
    marginRight: pxToDp(5)
  },
  userName: {
    fontSize: pxToDp(26),
    color: Colors.darkGrey
  },
  content: {
    marginTop: pxToDp(8),
    fontSize: pxToDp(28),
    lineHeight: pxToDp(32),
    fontWeight: '500',
    color: Colors.darkBlack
  },
  commentDate: {
    color: Colors.darkGrey,
    fontSize: pxToDp(22),
    marginLeft: pxToDp(20),
    lineHeight: pxToDp(32)
  }
})