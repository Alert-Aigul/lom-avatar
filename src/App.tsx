import React, { useState, useRef } from "react";
import { Upload, Download, Sparkles } from "lucide-react";

export default function MushroomImageEditor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const processImage = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new window.Image();
      img.onload = async () => {
        // Создаём canvas для обработки
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Определяем размер для обрезки в квадрат (берём меньшую сторону)
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        // Устанавливаем размер canvas 300x300
        canvas.width = 300;
        canvas.height = 300;

        // Отрисовываем обрезанное и уменьшенное изображение
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          size,
          size, // Исходная область (квадрат)
          0,
          0,
          300,
          300 // Целевая область
        );

        // // Загружаем оверлей (пример - создаём рамку с эффектом)
        // // В реальном приложении здесь будет ваш PNG overlay
        // createOverlay(ctx);

          // Загружаем оверлей и рисуем его, затем экспортируем результат
        const overlayImg = new window.Image();
        overlayImg.src = "./overlay.png";
        overlayImg.onload = () => {
          ctx.drawImage(overlayImg, 0, 0, 300, 300);
          const resultDataUrl = canvas.toDataURL("image/png");
          setProcessedImage(resultDataUrl);
          if (e.target && typeof e.target.result === "string") {
            setOriginalImage(e.target.result);
          }
          setIsProcessing(false);
        };
        overlayImg.onerror = () => {
          // Если overlay не загрузился, просто экспортируем без него
          const resultDataUrl = canvas.toDataURL("image/png");
          setProcessedImage(resultDataUrl);
          if (e.target && typeof e.target.result === "string") {
            setOriginalImage(e.target.result);
          }
          setIsProcessing(false);
        };

        // // Сохраняем результат
        // const resultDataUrl = canvas.toDataURL("image/png");
        // setProcessedImage(resultDataUrl);
        // if (e.target && typeof e.target.result === "string") {
        //   setOriginalImage(e.target.result);
        // }
        // setIsProcessing(false);
      };

      if (e.target && typeof e.target.result === "string") {
        img.src = e.target.result;
      }
    };

    reader.readAsDataURL(file);
  };

  // const createOverlay = (ctx: CanvasRenderingContext2D) => {
  //   const overlayImg = new window.Image();
  //   overlayImg.src = "./overlay.png"; // путь к вашему PNG (положите файл в public)
  //   overlayImg.onload = () => {
  //     ctx.drawImage(overlayImg, 0, 0, 300, 300);
  //   };
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.download = "mushroom-avatar.png";
      link.href = processedImage;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Звёзды */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4 drop-shadow-lg">
            Aватар фикс ✨
          </h1>
          <p className="text-xl text-purple-200 drop-shadow-md">
            Обрежьте углы своего аватара для идеального сходства с рамкой в чате
          </p>
        </div>

        {/* Пример до/после */}
        {/* <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-3xl p-6 border-2 border-purple-400 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6 drop-shadow-md">
              Как это работает
            </h2>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-2xl filter blur-lg opacity-30"></div>
              <img
                src="URL_ВАШЕГО_ИЗОБРАЖЕНИЯ"
                alt="Пример до и после"
                className="relative w-full rounded-2xl shadow-2xl border-4 border-yellow-300"
              />
            </div>
          </div>
        </div> */}

        {/* Основной контент */}
        <div className="max-w-4xl mx-auto">
          {!processedImage ? (
            // Кнопка загрузки в центре
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="relative">
                {/* Светящийся круг */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full filter blur-xl opacity-50 animate-pulse"></div>

                <button
                  onClick={handleButtonClick}
                  disabled={isProcessing}
                  className="relative bg-gradient-to-br from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-400 hover:via-pink-400 hover:to-purple-500 text-white font-bold py-8 px-12 rounded-full text-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-3 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-yellow-300"
                >
                  <div className="flex items-center gap-4">
                    {isProcessing ? (
                      <>
                        <Sparkles className="animate-spin" size={32} />
                        <span>Обработка...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={32} />
                        <span>Выбрать фото</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Магические искры вокруг кнопки */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-ping"
                    style={{
                      top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                      left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: "2s",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            // Результат
            <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-400 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Оригинал */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-4 drop-shadow-md">
                    Оригинал
                  </h3>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl filter blur-md"></div>
                    <img
                      src={originalImage ?? undefined}
                      alt="Original"
                      className="relative rounded-2xl shadow-xl border-4 border-blue-300 max-w-full h-auto"
                    />
                  </div>
                </div>

                {/* Обработанное */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-pink-300 mb-4 drop-shadow-md">
                    Результат
                  </h3>
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl filter blur-md"></div>
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="relative"
                    />
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={handleButtonClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-blue-300"
                >
                  <Upload className="inline mr-2" size={20} />
                  Новое фото
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-green-300"
                >
                  <Download className="inline mr-2" size={20} />
                  Скачать
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Скрытый input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Нижний текст */}
      <div className="relative z-10 text-center pb-8">
        <p className="text-purple-300 text-sm opacity-75">
          Автоматическая обрезка 1:1 • Размер 300x300
        </p>
        <p className="text-purple-300 text-sm opacity-75">
          Сделано с ❤️ by Alerto
        </p>
      </div>
    </div>
  );
}
