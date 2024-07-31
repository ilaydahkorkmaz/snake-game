document.addEventListener('DOMContentLoaded', () => { // Sayfa tamamen yüklendiğinde çalışacak fonksiyon
  const board = document.getElementById('game-board'); // Oyun tahtası elementi
  const score = document.getElementById('score'); // Skor elementi
  const instructionText = document.getElementById('instruction-text'); // Talimat metni elementi
  const logo = document.getElementById('logo'); // Logo elementi
  const highScoreText = document.getElementById('highScore'); // En yüksek skor elementi
  const gridSize = 20; // Izgara boyutu
  let snake = [{ x: 10, y: 10 }]; // Yılanın başlangıç konumu
  let highScore = 0; // En yüksek skor başlangıç değeri
  let food = generateFood(); // Yiyecek üret
  let direction = 'right'; // Yılanın başlangıç yönü
  let gameSpeedDelay = 200; // Oyun hızı gecikmesi
  let gameStarted = false; // Oyunun başlayıp başlamadığını takip eder

  function startGame() { // Oyunu başlatma fonksiyonu
    gameStarted = true; // Oyun başladığında gameStarted'ı true yap
    instructionText.style.display = 'none'; // Talimat metnini gizle
    logo.style.display = 'none'; // Logoyu gizle
    gameInterval = setInterval(() => { // Oyun döngüsünü başlat
      move(); // Yılanı hareket ettir
      checkCollision(); // Çarpışma kontrolü yap
      draw(); // Oyun tahtasını çiz
    }, gameSpeedDelay); // Oyun hızı
  }

  function stopGame() { // Oyunu durdurma fonksiyonu
    clearInterval(gameInterval); // Oyun döngüsünü durdur
    gameStarted = false; // Oyun durduğunda gameStarted'ı false yap
    instructionText.style.display = 'block'; // Talimat metnini göster
    logo.style.display = 'block'; // Logoyu göster
  }

  function draw() { // Oyun tahtasını çizme fonksiyonu
    board.innerHTML = ''; // Oyun tahtasını temizle
    drawSnake(); // Yılanı çiz
    drawFood(); // Yiyeceği çiz
    updateScore(); // Skoru güncelle
  }

  function drawSnake() { // Yılanı çizme fonksiyonu
    snake.forEach((segment) => { // Her bir yılan segmenti için
      const snakeElement = createGameElement('div', 'snake'); // Yılan segmenti oluştur
      setPosition(snakeElement, segment); // Segmentin konumunu ayarla
      board.appendChild(snakeElement); // Segmenti oyun tahtasına ekle
    });
  }

  function drawFood() { // Yiyeceği çizme fonksiyonu
    const foodElement = createGameElement('div', 'food'); // Yiyecek elementi oluştur
    setPosition(foodElement, food); // Yiyeceğin konumunu ayarla
    board.appendChild(foodElement); // Yiyeceği oyun tahtasına ekle
  }

  function createGameElement(tag, className) { // Oyun elemanı oluşturma fonksiyonu
    const element = document.createElement(tag); // Yeni bir HTML elementi oluştur
    element.className = className; // Elementin sınıf adını ayarla
    return element; // Elementi döndür
  }

  function setPosition(element, position) { // Elementin konumunu ayarlama fonksiyonu
    element.style.gridColumn = position.x; // CSS gridColumn özelliğiyle konumu ayarla
    element.style.gridRow = position.y; // CSS gridRow özelliğiyle konumu ayarla
  }

  function generateFood() { // Yiyecek üretme fonksiyonu
    let newFood;
    do {
      newFood = { // Rastgele bir konumda yiyecek oluştur
        x: Math.floor(Math.random() * gridSize) + 1,
        y: Math.floor(Math.random() * gridSize) + 1,
      };
    } while (isFoodOnSnake(newFood)); // Yiyecek yılanın üzerinde mi kontrol et

    return newFood; // Yeni yiyecek konumunu döndür
  }

  function isFoodOnSnake(food) { // Yiyeceğin yılan üzerinde olup olmadığını kontrol etme fonksiyonu
    return snake.some( // Yiyecek yılanın herhangi bir segmentiyle çakışıyor mu kontrol et
      (segment) => segment.x === food.x && segment.y === food.y
    );
  }

  function move() { // Yılanı hareket ettirme fonksiyonu
    const head = { ...snake[0] }; // Yılanın başının bir kopyasını oluştur

    switch (direction) { // Yön değişkenine göre hareket et
      case 'up':
        head.y--; // Yukarı hareket
        break;
      case 'down':
        head.y++; // Aşağı hareket
        break;
      case 'left':
        head.x--; // Sola hareket
        break;
      case 'right':
        head.x++; // Sağa hareket
        break;
    }

    snake.unshift(head); // Yılanın başını yeni konuma ekle

    if (head.x === food.x && head.y === food.y) { // Yılan yiyeceği yedi mi kontrol et
      food = generateFood(); // Yeni yiyecek üret
      increaseSpeed(); // Oyun hızını artır
      clearInterval(gameInterval); // Mevcut oyun döngüsünü temizle
      gameInterval = setInterval(() => { // Yeni oyun döngüsü başlat
        move();
        checkCollision();
        draw();
      }, gameSpeedDelay);
    } else {
      snake.pop(); // Yiyecek yenmediyse yılanın kuyruğunu çıkar
    }
  }

  function increaseSpeed() { // Oyun hızını artırma fonksiyonu
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

  function handleKeyPress(event) { // Tuş basım işlemlerini kontrol etme fonksiyonu
    if (
      (!gameStarted && event.code === 'Space') || // Oyun başlamadıysa ve boşluk tuşuna basıldıysa
      (!gameStarted && event.key === ' ') // Oyun başlamadıysa ve boşluk tuşuna basıldıysa
    ) {
      startGame(); // Oyunu başlat
    } else {
      switch (event.key) { // Ok tuşlarına göre yön değiştir
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

  function checkCollision() { // Çarpışma kontrolü fonksiyonu
    const head = snake[0]; // Yılanın başı

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) { // Yılan duvara çarptı mı kontrol et
      resetGame(); // Oyunu sıfırla
    }

    for (let i = 1; i < snake.length; i++) { // Yılan kendine çarptı mı kontrol et
      if (head.x === snake[i].x && head.y === snake[i].y) {
        resetGame(); // Oyunu sıfırla
      }
    }
  }

  function updateScore() { // Skoru güncelleme fonksiyonu
    const currentScore = snake.length - 1; // Mevcut skor
    score.textContent = currentScore.toString().padStart(3, '0'); // Skoru 3 haneli göster
  }

  function updateHighScore() { // En yüksek skoru güncelleme fonksiyonu
    const currentScore = snake.length - 1; // Mevcut skor
    if (currentScore > highScore) { // Eğer mevcut skor en yüksek skordan büyükse
      highScore = currentScore; // En yüksek skoru güncelle
      highScoreText.textContent = highScore.toString().padStart(3, '0'); // En yüksek skoru 3 haneli göster
    }
    highScoreText.style.display = 'block'; // En yüksek skor metnini göster
  }

  function resetGame() { // Oyunu sıfırlama fonksiyonu
    updateHighScore(); // En yüksek skoru güncelle
    stopGame(); // Oyunu durdur
    snake = [{ x: 10, y: 10 }]; // Yılanı başlangıç konumuna geri döndür
    food = generateFood(); // Yeni bir yiyecek üret
    direction = 'right'; // Yılanın başlangıç yönünü sağa ayarla
    gameSpeedDelay = 200; // Oyun hızını başlangıç değerine geri döndür
    updateScore(); // Skoru güncelle (Bu fonksiyonun aşağıda çağrılması gerekiyor)
  }
});

