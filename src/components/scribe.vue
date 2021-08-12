<template>
  <div class="scribe">
    <div class="article" ref="article" @click.stop="showCancelTip" @mouseup.stop="onMouseup">{{ options.text }}</div>
    <div @click="mark" v-show="showTip" class="tips" :style="{left:tipLeft+'px',top:tipTop + 'px','--backgroundColor':options.btnBgColor,color:options.btnColor,fontSize:options.btnSize+'px'}">{{ tipText }}</div>
  </div>
</template>

<script>
export default {
  name: 'scribe',
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          text: '我是一段文本我是一段文本我是一段文本我是一段文本我是一段文本我是一段文本',
          lineColor:'#000',
          lineWidth:1,
          btnBgColor:'rgba(0,0,0,.6)',
          btnColor:'#fff',
          btnSize:16
        }
      }
    }
  },
  data() {
    return {
      tipText: '',
      tipLeft: null,
      tipTop: null,
      showTip: false,
      tipTextBool: true,
      serializeData: [],
      idx: 0,
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.closeTip)
  },
  methods: {
    closeTip() {
      if (!this.showTip) return;
      this.showTip = false;
      this.tipText = ''
    },
    onMouseup() {
      // 获取Selection对象，里面可能包含多个`ranges`（区域）
      let selObj = window.getSelection()
      // 一般就只有一个Range对象
      let range = selObj.getRangeAt(0)
      // 如果选区起始位置和结束位置相同，那代表没有选到任何东西
      if (range.collapsed) {
        return
      }
      this.range = range.cloneRange()
      this.tipText = '划线'
      this.tipTextBool = true
      this.setTip(range)
    },

    setTip(range) {
      let {left, top, width} = range.getBoundingClientRect()
      this.tipLeft = left + (width - 80) / 2
      this.tipTop = top - 40 - 10
      this.showTip = true
    },

    mark() {
      if (!this.tipTextBool) {
        this.cancelMark();
        return;
      }
      this.textNodes = []
      let {commonAncestorContainer, startContainer, endContainer} = this.range
      this.walk(commonAncestorContainer, (node) => {
        if (
            node === startContainer ||
            node === endContainer ||
            this.range.isPointInRange(node, 0)
        ) {// 起始和结束节点，或者在范围内的节点，如果是文本节点则收集起来
          if (node.nodeType === 3) {
            this.textNodes.push(node)
          }
        }
      })
      this.handleTextNodes()
      this.showTip = false
      this.tipText = ''
    },
    walk(node, callback = () => {
    }) {
      callback(node)
      if (node && node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
          this.walk(node.childNodes[i], callback)
        }
      }
    },
    handleTextNodes() {
      // 生成本次的唯一id
      let id = ++this.idx
      // 遍历文本节点
      this.textNodes.forEach((node) => {
        // 范围的首尾元素需要判断一下偏移量，用来截取字符
        let startOffset = 0
        let endOffset = node.nodeValue.length
        if (
            node === this.range.startContainer &&
            this.range.startOffset !== 0
        ) {
          startOffset = this.range.startOffset
        }
        if (node === this.range.endContainer && this.range.endOffset !== 0) {
          endOffset = this.range.endOffset
        }
        // 替换该文本节点
        this.replaceTextNode(node, id, startOffset, endOffset)
      })
      // 序列化进行存储，获取刚刚生成的所有该id的划线元素
      this.serialize(this.$refs.article.querySelectorAll('.mark_id_' + id))
    },

    replaceTextNode(node, id, startOffset, endOffset) {
      // 创建一个文档片段用来替换文本节点
      let fragment = document.createDocumentFragment()
      let startNode = null
      let endNode = null
      // 截取前一段不需要划线的文本
      if (startOffset !== 0) {
        startNode = document.createTextNode(
            node.nodeValue.slice(0, startOffset)
        )
      }
      // 截取后一段不需要划线的文本
      if (endOffset !== 0) {
        endNode = document.createTextNode(node.nodeValue.slice(endOffset))
      }
      startNode && fragment.appendChild(startNode)

      // 改成直接包裹整块文本
      let textNode = document.createElement('span')
      textNode.className = 'markLine mark_id_' + id
      let options = this.options
      textNode.style.cssText = `border-bottom:${options.lineWidth}px solid ${options.lineColor}`
      textNode.setAttribute('data-id', id)
      textNode.textContent = node.nodeValue.slice(startOffset, endOffset)
      fragment.appendChild(textNode)

      endNode && fragment.appendChild(endNode)
      // 替换文本节点
      node.parentNode.replaceChild(fragment, node)
    },
    serialize(markNodes) {
      // 选择article元素作为根元素，这样的好处是页面的其他结构如果改变了不影响划线元素的定位
      let root = this.$refs.article
      // 遍历刚刚生成的本次划线的所有span节点
      markNodes.forEach((markNode) => {
        // 计算该字符离外层第一个非划线元素的总的文本偏移量
        let offset = this.getTextOffset(markNode)
        // 找到外层第一个非划线元素
        let {tagName, index} = this.getWrapNode(markNode, root)
        // 保存相关数据

        let textLength = markNode.textContent.length
        if (textLength > 0) {// 过滤掉长度为0的空字符，否则会有不可预知的问题
          this.serializeData.push({
            tagName,
            index,
            offset,
            length: textLength,// ++
            id: markNode.getAttribute('data-id')
          })
        }
      })
    },

    getTextOffset(node) {
      let offset = 0
      let parNode = node
      // 遍历直到外层第一个非划线元素
      while (parNode && parNode.classList.contains('markLine')) {
        // 获取前面的兄弟元素的总字符数
        offset += this.getPrevSiblingOffset(parNode)
        parNode = parNode.parentNode
      }
      return offset
    },
    getPrevSiblingOffset(node) {
      let offset = 0
      let prevNode = node.previousSibling
      while (prevNode) {
        offset +=
            prevNode.nodeType === 3
                ? prevNode.nodeValue.length
                : prevNode.textContent.length
        prevNode = prevNode.previousSibling
      }
      return offset
    },

    getWrapNode(node, root) {
      // 找到外层第一个非划线元素
      let wrapNode = node.parentNode

      while (wrapNode.classList.contains('markLine')) {
        wrapNode = wrapNode.parentNode
      }
      let wrapNodeTagName = wrapNode.tagName
      // 计算索引
      let wrapNodeIndex = -1
      // 使用标签选择器获取所有该标签元素
      let els = root.getElementsByTagName(wrapNodeTagName)
      els = [...els].filter((item) => {// 过滤掉划线元素
        return !item.classList.contains('markLine');
      }).forEach((item, index) => {// 计算当前元素在其中的索引
        if (wrapNode === item) {
          wrapNodeIndex = index
        }
      })
      return {
        tagName: wrapNodeTagName,
        index: wrapNodeIndex
      }
    },
    // deserialization () {
    //   let root = this.$refs.article
    //   markData.forEach((item) => {
    //     let wrapNode = root.getElementsByTagName(item.tagName)[item.index]
    //     let len = 0
    //     let end = false
    //     let first = true
    //     let _length = item.length
    //     this.walk(wrapNode, (node) => {
    //       if (end) {
    //         return
    //       }
    //       if (node.nodeType === 3) {
    //         let nodeTextLength = node.nodeValue.length
    //         if (len + nodeTextLength > _offset) {
    //           // startOffset之前的文本不需要划线
    //           let startOffset = (first ? item.offset - len : 0)
    //           first = false
    //           // 如果该文本节点剩余的字符数量小于划线文本的字符长度的话代表该文本节点还只是划线文本的一部分，还需要到下一个文本节点里去处理
    //           let endOffset = startOffset + (nodeTextLength - startOffset >= _length ? _length : nodeTextLength - startOffset)
    //           this.replaceTextNode(node, item.id, startOffset, endOffset)
    //           // 长度需要减去之前节点已经处理掉的长度
    //           _length = _length - (nodeTextLength - startOffset)
    //           // 如果剩余要处理的划线文本的字符数量为0代表已经处理完了，可以结束了
    //           if (_length <= 0) {
    //             end = true
    //           }
    //         }
    //         len += nodeTextLength
    //       }
    //     })
    //   })
    // },
    // 显示取消划线的tooltip
    showCancelTip(e) {
      let tar = e.target
      if (tar.classList.contains('markLine')) {
        e.stopPropagation()
        e.preventDefault()
        // 获取划线id
        this.clickId = tar.getAttribute('data-id')
        // 获取该id的所有划线元素
        let markNodes = document.querySelectorAll('.mark_id_' + this.clickId)
        // 选择第一个和最后一个文本节点来作为range边界
        let startContainer = markNodes[0].firstChild
        let endContainer = markNodes[markNodes.length - 1].lastChild
        this.range = document.createRange()
        this.range.setStart(startContainer, 0)
        this.range.setEnd(
            endContainer,
            endContainer.nodeValue.length
        )
        this.tipText = '取消划线'
        this.tipTextBool = false
        this.setTip(this.range)
      }
    },


    cancelMark() {
      this.showTip = false
      this.tipText = ''
      let markNodes = document.querySelectorAll('.mark_id_' + this.clickId)
      for (let i = 0; i < markNodes.length; i++) {
        let item = markNodes[i]
        let fregment = document.createDocumentFragment()
        for (let j = 0; j < item.childNodes.length; j++) {
          fregment.appendChild(item.childNodes[j].cloneNode(true))
        }
        item.parentNode.replaceChild(fregment, item)
      }
      this.serializeData = this.serializeData.filter((item) => {
        return item.id !== this.clickId
      })
    }
  },
  beforeDestroy() {
    document.addEventListener('mouseup', this.closeTip)
  }
}
</script>

<style scoped>
/deep/ .markLine {
  display: inline;
}

.article {
  margin: 100px;
}

.tips {
  position: fixed;
  padding: 10px 20px;
  box-sizing: border-box;
  background-color: var(--backgroundColor);
  border-radius: 10px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}

.tips::after{
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  bottom: -10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--backgroundColor);
  content: '';
}

</style>
