// 1) HTML'den DOM öğelerini tanımlayın.
const board = document.getElementById('game-board'); // Oyun tahtası elementi
const instructionText = document.getElementById('instruction-text'); // Talimat metni elementi
const logo = document.getElementById('logo'); // Logo elementi
const score = document.getElementById('score'); // Skor elementi
const highScoreText = document.getElementById('highScore'); // En yüksek skor elementi

// Oyun değişkenlerini tanımlayın
const gridSize = 20; // Izgara boyutu (Oyun tahtası 20x20)
let snake = [{ x: 10, y: 10 }]; // Yılanın başlangıç konumu
let food = generateFood(); // Yiyecek üret
let highScore = 0; // En yüksek skor başlangıç değeri
let direction = 'right'; // Yılanın başlangıç yönü
let gameInterval; // Oyun döngüsü için zamanlayıcı
let gameSpeedDelay = 200; // Oyun hızı gecikmesi
let gameStarted = false; // Oyunun başlayıp başlamadığını takip eder

// 1) Oyun haritasını, yılanı ve yiyeceği çizin
function draw() {
  board.innerHTML = ''; // Oyun tahtasını temizleyin (Önceden oyun başladıysa)
  drawSnake(); // 2) Yılanı çiz
  drawFood(); // 6 Yiyeceği çiz
  updateScore(); // Skoru güncelle
}

// 2) Yılanı çizme fonksiyonu
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake'); // Yılan segmenti oluştur
    setPosition(snakeElement, segment); // Segmentin konumunu ayarla
    board.appendChild(snakeElement); // Segmenti oyun tahtasına ekle
  });
}

// 3) Yılan veya yiyecek küpü oluşturma
function createGameElement(tag, className) {
  const element = document.createElement(tag); // Yeni bir HTML elementi oluştur
  element.className = className; // Elementin sınıf adını ayarla
  return element; // Elementi döndür
}

// 4) Yılan veya yiyeceğin konumunu ayarla
function setPosition(element, position) {
  element.style.gridColumn = position.x; // CSS gridColumn özelliğiyle konumu ayarla
  element.style.gridRow = position.y; // CSS gridRow özelliğiyle konumu ayarla
}

// 5 Test amacıyla çiz fonksiyonunu çağır
// draw();

// 6) Yiyeceği çizme fonksiyonu
function drawFood() {
  if (gameStarted) { // Eğer oyun başladıysa
    const foodElement = createGameElement('div', 'food'); // Yiyecek elementi oluştur
    setPosition(foodElement, food); // Yiyeceğin konumunu ayarla
    board.appendChild(foodElement); // Yiyeceği oyun tahtasına ekle
  }
}

// 7) Yılanın konumunu hesaba katmadan yiyecek üretme fonksiyonu
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1; // Rastgele x konumu üret
  const y = Math.floor(Math.random() * gridSize) + 1; // Rastgele y konumu üret
  return { x, y }; // Yeni konumu döndür
}

// 8) Yılanı hareket ettirme fonksiyonu
function move() {
  const head = { ...snake[0] }; // Yılanın başının bir kopyasını oluştur
  switch (direction) { // Yön değişkenine göre hareket et
    case 'up':
      head.y--; // Yılan yukarı hareket eder
      break;
    case 'down':
      head.y++; // Yılan aşağı hareket eder
      break;
    case 'left':
      head.x--; // Yılan sola hareket eder
      break;
    case 'right':
      head.x++; // Yılan sağa hareket eder
      break;
  }

  snake.unshift(head); // Yılanın başını yeni konuma ekle

  if (head.x === food.x && head.y === food.y) { // Yılan yiyeceği yedi mi kontrol et
    food = generateFood(); // Yiyeceği yeni bir konuma yerleştir
    increaseSpeed(); // 14) Oyunun hızını artır
    clearInterval(gameInterval); // Eski zamanlayıcıyı temizle
    gameInterval = setInterval(() => { // Yeni oyun döngüsü başlat
      move();
      checkCollision(); // Çarpışma kontrolü
      draw();
    }, gameSpeedDelay); // Oyun hızı
  } else {
    snake.pop(); // Yiyecek yenmediyse yılanın kuyruğunu çıkar
  }
}

// 12) Oyunu başlatma fonksiyonu
function startGame() {
  gameStarted = true; // Oyun başladı
  instructionText.style.display = 'none'; // Başlangıç talimatlarını ve logoyu gizle
  logo.style.display = 'none';
  gameInterval = setInterval(() => { // Oyun döngüsünü başlat
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay); // Oyun hızı
}

// 13) Tuş basım işlemleri
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') || // Oyun başlamadıysa ve boşluk tuşuna basıldıysa
    (!gameStarted && event.key === ' ') // Oyun başlamadıysa ve boşluk tuşuna basıldıysa
  ) {
    startGame(); // Oyunu başlat
  } else {
    // Ok tuşlarına göre yön değiştir
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up'; // Yukarı yönü
        break;
      case 'ArrowDown':
        direction = 'down'; // Aşağı yönü
        break;
      case 'ArrowLeft':
        direction = 'left'; // Sol yönü
        break;
      case 'ArrowRight':
        direction = 'right'; // Sağ yönü
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress); // Tuş basımı olayını dinle

// 14) Oyunun hızını artırma fonksiyonu
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5; // Hızı 5 ms azalt
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3; // Hızı 3 ms azalt
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2; // Hızı 2 ms azalt
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1; // Hızı 1 ms azalt
  }
}

// 15) Çarpışma kontrolü fonksiyonu
function checkCollision() {
  const head = snake[0];

  // Yılanın duvara çarpıp çarpmadığını kontrol et
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame(); // Oyunu sıfırla
  }

  // Yılanın kendine çarpıp çarpmadığını kontrol et
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame(); // Oyunu sıfırla
    }
  }
}

// 16) Oyunu sıfırlama fonksiyonu
function resetGame() {
  updateHighScore(); // En yüksek skoru güncelle
  stopGame(); // Oyunu durdur
  snake = [{ x: 10, y: 10 }]; // Yılanı başlangıç konumuna ayarla
  food = generateFood(); // Yeni yiyecek üret
  direction = 'right'; // Yönü sağa ayarla
  gameSpeedDelay = 200; // Oyun hızını başlangıç değerine ayarla
  updateScore(); // Skoru güncelle
}

// 17) Skoru güncelleme fonksiyonu
function updateScore() {
  const currentScore = snake.length - 1; // Yılanın uzunluğu 1'den başlar
  score.textContent = currentScore.toString().padStart(3, '0'); // Skoru 3 haneli göster
}

// 18) Oyunu durdurma fonksiyonu
function stopGame() {
  clearInterval(gameInterval); // Oyun döngüsünü durdur
  gameStarted = false; // Oyunun durduğunu belirt
  instructionText.style.display = 'block'; // Talimat metnini göster
  logo.style.display = 'block'; // Logoyu göster
}

// 19) En yüksek skoru güncelleme fonksiyonu

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
} 