<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Distribution Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 2px solid #004d40;
            background: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #004d40;
            padding-bottom: 20px;
            position: relative;
        }
        .logo {
            text-align: center;
            margin-bottom: 10px;
        }
        .logo h1 {
            margin: 0;
            font-size: 28px;
            color: #004d40;
            font-weight: bold;
        }
        .header h2 {
            margin: 5px 0;
            font-size: 20px;
            color: #004d40;
        }
        .header .receipt-number {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 14px;
            color: #004d40;
            font-weight: bold;
        }
        .receipt-info {
            margin-bottom: 30px;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .section-title {
            background: #004d40;
            color: white;
            padding: 8px 15px;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .receipt-info table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .receipt-info td, .receipt-info th {
            padding: 12px;
            border: 1px solid #ccc;
        }
        .receipt-info th {
            background: #f5f5f5;
            font-weight: bold;
            text-align: left;
            width: 200px;
        }
        .receipt-info td {
            background: white;
        }
        .signatures {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            text-align: center;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 5px;
        }
        .footer {
            margin-top: 40px;
            border-top: 2px solid #004d40;
            padding-top: 20px;
            text-align: center;
            font-size: 10px;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            opacity: 0.05;
            color: #004d40;
            z-index: -1;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="watermark">AGRICORD</div>
    <div class="container">
        <div class="header">
            <div class="logo">
                <h1>AgriCord</h1>
            </div>
            <h2>OFFICIAL DISTRIBUTION RECEIPT</h2>
            <div class="receipt-number">Receipt No: {{ $distribution['distribution_id'] }}</div>
        </div>
        
        <div class="receipt-info">
            <div class="info-section">
                <div class="section-title">Distribution Details</div>
                <table>
                    <tr>
                        <th>Date Issued:</th>
                        <td>{{ $distribution['date'] }}</td>
                    </tr>
                    <tr>
                        <th>Time:</th>
                        <td>{{ $distribution['time'] }}</td>
                    </tr>
                    <tr>
                        <th>Status:</th>
                        <td>{{ $distribution['status'] }}</td>
                    </tr>
                </table>
            </div>

            <div class="info-section">
                <div class="section-title">Farmer Information</div>
                <table>
                    <tr>
                        <th>Farmer Name:</th>
                        <td>{{ $distribution['farmer_name'] }}</td>
                    </tr>
                    <tr>
                        <th>Farmer ID:</th>
                        <td>{{ $distribution['farmer_id'] }}</td>
                    </tr>
                    <tr>
                        <th>Barangay:</th>
                        <td>{{ $distribution['barangay'] }}</td>
                    </tr>
                </table>
            </div>

            <div class="info-section">
                <div class="section-title">Item Details</div>
                <table>
                    <tr>
                        <th>Item Type:</th>
                        <td>{{ $distribution['item_type'] }}</td>
                    </tr>
                    <tr>
                        <th>Item Name:</th>
                        <td>{{ $distribution['item_name'] }}</td>
                    </tr>
                    <tr>
                        <th>Crop Type:</th>
                        <td>{{ $distribution['crop_type'] }}</td>
                    </tr>
                    <tr>
                        <th>Variety:</th>
                        <td>{{ $distribution['variety'] }}</td>
                    </tr>
                    <tr>
                        <th>Quantity:</th>
                        <td>{{ $distribution['quantity'] }} {{ $distribution['unit'] }}</td>
                    </tr>
                </table>
            </div>

            @if($distribution['notes'])
            <div class="info-section">
                <div class="section-title">Additional Notes</div>
                <table>
                    <tr>
                        <th>Notes:</th>
                        <td>{{ $distribution['notes'] }}</td>
                    </tr>
                </table>
            </div>
            @endif

            <div class="signatures">
                <div class="signature-box">
                    <div class="signature-line">{{ $distribution['farmer_name'] }}</div>
                    <p>Farmer's Signature</p>
                </div>
                <div class="signature-box">
                    <div class="signature-line">{{ $distribution['distributed_by'] }}</div>
                    <p>Distributed By</p>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>This document serves as an official record of agricultural input distribution by AgriCord.</p>
            <p>For verification and inquiries, please contact the AgriCord administrator.</p>
            <p><strong>Generated on:</strong> {{ date('F d, Y h:i:s A') }}</p>
        </div>
    </div>
</body>
</html>