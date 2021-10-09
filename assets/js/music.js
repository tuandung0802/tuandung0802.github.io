/*
render songs
scroll top
play/ pause/ seek
CD rotate
Next/ prev
Random
Next/ Repeat
Active Song
Scroll active song
Play song
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player =$('.player-music')
console.log(player)
const PLAYER_STORAGE_KEY = 'MS_PLAYER'
const playlist = $('.playlist')
const musicCD = $('.musicCD')
const heading = $('header h2')
const musicCDthumb = $('.musicCD-thumb')
const audio =$('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app={
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    isPlaying : false,
    currentIndex: 0,
    isRandom : false,
    isRepeat: false,
    songs: [{
        name: 'Chúng ta không thuộc về nhau',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/chungtakhongthuocvenhau.mp3',
        image: './assets/img/chungtakhongthuocvenhau.png'

    },
    {
        name: 'Chúng ta của hiện tại ',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/chungtacuahientai.mp3',
        image: './assets/img/chungtacuahientai.png'
        

    },
    {
        name: 'Em của ngày hôm qua',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/emcuangayhomqua.mp3',
        image: './assets/img/emcuangayhomqua.png'

    },
    {
        name: 'Hạnh phúc mới ',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/hanhphucmoi.mp3',
        image: './assets/img/hanhphucmoi.png'

    },
    {
        name: 'Gác lại lo âu',
        singer: 'Da Lab',
        path: './assets/music/gaclailoau.mp3',
        image: './assets/img/gaclailoau.png'

    },
    {
        name: 'Lạ lùng',
        singer: 'Vũ',
        path: './assets/music/lalung.mp3',
        image: './assets/img/lalung.png'

    },
    

    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
        
    },
    handleEvents: function(){
        const _this = this
        
        const musicCDWidth = musicCD.offsetWidth
        // Xử lí CD quay và dừng
        const musicCDthumbAnimate = musicCDthumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000, //10 giây
            iterations: Infinity
        })
        musicCDthumbAnimate.pause()
        



        //  Xử lý phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newmusicCDWidth =  musicCDWidth - scrollTop
            

            musicCD.style.width = newmusicCDWidth > 0 ? newmusicCDWidth + 'px' : 0 
            musicCD.style.opacity = newmusicCDWidth / musicCDWidth
        }
        //  Xử lí kgi kick play
            playBtn.onclick = function(){
                if (_this.isPlaying){
                    audio.pause()  
                }else{
                    audio.play()
                }
            }

            //  Khi bài hát được play 
            audio.onplay = function(){
                _this.isPlaying=true
                player.classList.add('playing')
                musicCDthumbAnimate.play()
            }
            
            //  Khi bài hát pause
            audio.onpause = function(){
                _this.isPlaying=false
                player.classList.remove('playing')
                musicCDthumbAnimate.pause()

            }
            //  Khi tiến độ bài hát thay đổi
            audio.ontimeupdate=function(){
                if(audio.duration){
                    const progressPercents = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercents
                    progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + progressPercents + '%, #d3d3d3 ' + progressPercents+ '%, #d3d3d3 100%)'
                }
            }
                

            
            // xử lí khi tua song
            progress.oninput = function(e){
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }
            // Khi next song 
            nextBtn.onclick = function(){
                if (_this.isRandom){
                    _this.playRandomSong()
                }else{
                    _this.nextSong()
                }
                
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            // Khi prev song 
            prevBtn.onclick = function(){
                if (_this.isRandom){
                    _this.playRandomSong()
                }else{
                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }
            //Khi click random song
            randomBtn.onclick = function(){
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active',_this.isRandom)
                
                
            }
            // xử lí khi phát lại
            repeatBtn.onclick = function(e){
                    _this.isRepeat = !_this.isRepeat
                    _this.setConfig('isRepeat', _this.isRepeat)
                    repeatBtn.classList.toggle('active',_this.isRepeat)
            }
            //  xử lí next song khi audio end
            audio.onended = function(){
                if(_this.isRepeat = true){
                    audio.play()
                }else{
                nextBtn.click()
                }
            }
            // Lắng nghe clock hành vi vào playlist
            playlist.onclick = function(e){
                const songNode = e.target.closest('.song:not(.active)')
                //  Xử lí khi click vào song
                if (songNode || e.target.closest('.option')){
                        // Xử lí click vào song
                        if (songNode){
                            _this.currentIndex =Number(songNode.dataset.index)
                            _this.loadCurrentSong()
                            audio.play()
                            _this.render()
                            // console.log(songNode.dataset.index)
                        }
                        // Xử lí khi click vào song option
                        if (e.target.closest('.option')){

                        }
                }
            }
            
    },
    loadCurrentSong:function(){
        
        
        heading.textContent = this.currentSong.name
        musicCDthumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        console.log(heading,musicCDthumb,audio)

    },
    scrollToActiveSong(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'end'
            })
        }, 300)
    },
    loadConfig:function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        // Object.assign(this, this.config)
    },
    nextSong:function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong:function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex= this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong:function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    
    start: function(){
        //  Gán cấu hình từ config vào ứng dụng
        this.loadConfig()
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()
        // Lắng nghe/  xử lí các sự kiện (DOM events)
        this.handleEvents()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        // Render Playlist
        this.render()
        //  hiển thị config
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
    }
}
app.start()