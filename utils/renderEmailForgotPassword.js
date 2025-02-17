const renderEmailForgotPassword = (username, code) => {
  return `
    <!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mã Xác Nhận Email</title>
    <style>
        /* Reset mặc định */
        body, h1, p {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }

        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #dddddd;
        }

        .header h1 {
            color: #333333;
            font-size: 24px;
        }

        .content {
            padding: 20px 0;
        }

        .content p {
            margin: 10px 0;
            color: #555555;
            line-height: 1.6;
        }

        .code {
            display: block;
            font-size: 20px;
            color: #ffffff;
            background-color: #4CAF50;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
            margin: 20px 0;
            text-decoration: none;
        }

        .footer {
            text-align: center;
            color: #aaaaaa;
            font-size: 12px;
            margin-top: 20px;
            border-top: 1px solid #dddddd;
            padding-top: 10px;
        }

        .footer a {
            color: #555555;
            text-decoration: none;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #4CAF50;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #45a049;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h1>Xác Nhận Email</h1>
        </div>
        <div class="content">
            <p>Xin chào ${username},</p>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu từ bạn. Vui lòng sử dụng mã xác nhận dưới đây để tiếp tục quá trình đặt lại mật khẩu.</p>
            <a class="code">${code}</a>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với đội ngũ hỗ trợ của chúng tôi để được trợ giúp.</p>
            <p>Trân trọng,<br>Đội ngũ Mia Studio</p>
            <a href="#" class="button">Liên hệ Hỗ trợ</a>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Mia Studio. Tất cả các quyền được bảo lưu.</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng truy cập <a href="#">Trung tâm hỗ trợ</a>.</p>
        </div>
    </div>
</body>

</html>

    `;
};

module.exports = renderEmailForgotPassword;
