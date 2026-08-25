const BOT_TOKEN = "8818403995:AAGoAfm8pluw0Yu7U8vlndYGOWfWDtryd1w";
const CHAT_ID = "-1206791949";


/* =========================================
   ПРОВЕРКА WEB APP
========================================= */

function doGet() {
  return ContentService
    .createTextOutput("Telegram API работает ✅")
    .setMimeType(ContentService.MimeType.TEXT);
}


/* =========================================
   ПОЛУЧЕНИЕ ЗАКАЗА ОТ САЙТА
========================================= */

function doPost(e) {

  try {

    if (!e || !e.postData || !e.postData.contents) {

      return jsonResponse({
        success: false,
        error: "Нет данных заказа"
      });

    }


    const data =
      JSON.parse(e.postData.contents);


    const orderNumber =
      data.orderNumber || "Не указан";

    const playerId =
      data.playerId || "Не указан";

    const total =
      data.total || 0;

    const paymentMethod =
      data.paymentMethod || "Не указан";

    const items =
      data.items || "Не указано";


    const message =
      "🛒 НОВЫЙ ЗАКАЗ\n\n" +

      "🔢 Номер заказа:\n" +
      orderNumber +
      "\n\n" +

      "🎮 Игровой ID:\n" +
      playerId +
      "\n\n" +

      "📦 Товары:\n" +
      items +
      "\n\n" +

      "💰 Сумма:\n" +
      formatMoney(total) +
      " ₽\n\n" +

      "💳 Способ оплаты:\n" +
      paymentMethod +
      "\n\n" +

      "⏳ Статус:\n" +
      "Новый";


    const telegramUrl =
      "https://api.telegram.org/bot" +
      BOT_TOKEN +
      "/sendMessage";


    const telegramResponse =
      UrlFetchApp.fetch(
        telegramUrl,
        {
          method: "post",

          contentType:
            "application/json",

          payload:
            JSON.stringify({
              chat_id: CHAT_ID,
              text: message
            }),

          muteHttpExceptions: true
        }
      );


    const responseText =
      telegramResponse.getContentText();


    let telegramResult;


    try {

      telegramResult =
        JSON.parse(responseText);

    } catch (parseError) {

      telegramResult = {
        ok: false,
        description: responseText
      };

    }


    if (!telegramResult.ok) {

      return jsonResponse({
        success: false,
        error:
          telegramResult.description ||
          "Telegram не принял сообщение"
      });

    }


    return jsonResponse({
      success: true,
      message: "Заказ отправлен в Telegram"
    });


  } catch (error) {

    return jsonResponse({
      success: false,
      error: error.toString()
    });

  }

}


/* =========================================
   ФОРМАТ СУММЫ
========================================= */

function formatMoney(value) {

  const number =
    Number(value) || 0;


  return number.toLocaleString("ru-RU");

}


/* =========================================
   JSON RESPONSE
========================================= */

function jsonResponse(data) {

  return ContentService
    .createTextOutput(
      JSON.stringify(data)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );

}