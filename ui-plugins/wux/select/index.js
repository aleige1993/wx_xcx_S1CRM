import baseComponent from '../helpers/baseComponent'
import classNames from '../helpers/classNames'

const defaults = {
    prefixCls: 'wux-select',
    value: '',
    titles: [],   // value 对应的 title
    options: [],
    multiple: false,
    max: -1,
    toolbar: {
        title: '请选择',
        cancelText: '取消',
        confirmText: '确定',
        allText: '全选'
    },
    onChange() {},
    onConfirm() {},
    onCancel() {},
    onAll(){},
}

const getSelectIndex = ({ value = '', options = [], multiple = false }) => {
    const origins = options.map((n) => n.value || n)

    if (!multiple) {
        return origins.indexOf(value)
    }

    return (value || []).map((n) => origins.indexOf(n))
}

baseComponent({
    useFunc: true,
    data: defaults,
    computed: {
        classes() {
            const { prefixCls } = this.data
            const wrap = classNames(prefixCls)
            const toolbar = `${prefixCls}__toolbar`
            const inner = `${prefixCls}__inner`
            const cancel = classNames(`${prefixCls}__button`, {
                [`${prefixCls}__button--cancel`]: true
            })
            const confirm = classNames(`${prefixCls}__button`, {
                [`${prefixCls}__button--confirm`]: true
            })
            const hover = `${prefixCls}__button--hover`
            const title = `${prefixCls}__title`
            const scrollView = `${prefixCls}__scroll-view`

            return {
                wrap,
                toolbar,
                inner,
                cancel,
                confirm,
                hover,
                title,
                scrollView,
            }
        },
    },
    methods: {
        /**
         * 打开
         */
        open(opts = {}) {
            const options = this.$$mergeOptionsAndBindMethods(Object.assign({}, defaults, opts, {
                max: parseInt(opts.max),
            }))
            const index = getSelectIndex(options)

            // scroll into view
            let activeIndex = Array.isArray(index) ? index[index.length - 1] : index
            if (activeIndex === -1 || activeIndex === undefined) {
                activeIndex = 0
            }
            activeIndex = `select-${activeIndex}`

            this.$$setData({ in: true, ...options, index, activeIndex })
        },
        /**
         * 关闭
         */
        close(callback) {
            this.$$setData({ in: false })

            if (typeof callback === 'function') {
                const { value, index, options, titles } = this.data
                callback.call(this, value, index, options, titles)
            }
        },
        /**
         * 点击确定按钮时的回调函数
         */
        onConfirm() {
            this.close(this.fns.onConfirm)
        },
        /**
         * 点击取消按钮时的回调函数
         */
        onCancel(e) {
            this.close(this.fns.onCancel)
        },
        /**
         * 点击全选按钮时的回调函数
         */
        onSelectedAll(e) {
          const {value, options} = this.data
          let arr = [], arrIds = [], index = []
          if(value.length != this.data.options.length){
            arr = this.data.options.map((n) => n.value)
            arrIds = this.data.options.map((n) => n.title)
            index = getSelectIndex({ ...this.data, arr })
          }

          this.$$setData({ value: arr, titles: arrIds, index })

          if (typeof this.fns.onAll === 'function') {
            this.fns.onAll.call(this, arr, arrIds, options)
          }
        },
        /**
         * checkbox change 事件触发的回调函数
         */
        onCheckboxChange(e) {
            const oldValue = this.data.value
            const { value: newValue, checked } = e.detail
            const value = checked ? [...oldValue, newValue] : oldValue.filter((n) => n !== newValue)
            const index = getSelectIndex({ ...this.data, value })

            const oldTitles = this.data.titles
            const options = this.data.options
            let newTitle = ''
            options.forEach((n) => {
              if(n.value === newValue){
                newTitle = n.title
              }
            })
            const titles = checked ? [...oldTitles, newTitle] : oldTitles.filter((n) => n !== newTitle)
            this.onChange(value, index, titles)
        },
        /**
         * radio change 事件触发的回调函数
         */
        onRadioChange(e) {
            const { value, index } = e.detail

            this.onChange(value, index)
        },
        /**
         * 选择完成后的回调函数
         */
        onChange(value, index, tts) {
            const { options, max, multiple } = this.data

            // 限制最多选择几项
            if (multiple && max >= 1 && max < value.length) return

            const titles = tts || []

            this.$$setData({ value, index, titles })

            if (typeof this.fns.onChange === 'function') {
              this.fns.onChange.call(this, value, index, options, titles)
            }
        },
    },
})
