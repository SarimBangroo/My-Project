import os
from jinja2 import Template
from weasyprint import HTML, CSS
from pathlib import Path
import base64
import requests
from datetime import datetime

class PackagePDFGenerator:
    def __init__(self):
        self.template_dir = Path(__file__).parent / 'templates'
        self.template_dir.mkdir(exist_ok=True)
        
    def create_package_pdf(self, package_data, client_info=None):
        """Generate a beautiful PDF matching the Kashmir package format"""
        
        # HTML template matching the exact format from your PDF
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>{{ package.title }} - G.M.B Travels Kashmir</title>
            <style>
                @page {
                    size: A4;
                    margin: 20mm;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.4;
                    color: #333;
                    background: #fff;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 3px solid #D97706;
                    padding-bottom: 20px;
                }
                
                .header h1 {
                    font-size: 28px;
                    color: #D97706;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .header .subtitle {
                    font-size: 14px;
                    color: #666;
                    font-style: italic;
                }
                
                .hero-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                
                .package-overview {
                    background: linear-gradient(135deg, #FEF3E2, #FDE68A);
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                    border-left: 5px solid #D97706;
                }
                
                .package-overview h2 {
                    color: #92400E;
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                
                .package-details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                }
                
                .package-details .detail-item {
                    flex: 1;
                    text-align: center;
                    padding: 10px;
                    background: white;
                    margin: 0 5px;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .detail-item .value {
                    font-size: 18px;
                    font-weight: bold;
                    color: #D97706;
                }
                
                .detail-item .label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                }
                
                .day-section {
                    margin-bottom: 25px;
                    page-break-inside: avoid;
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .day-header {
                    background: linear-gradient(135deg, #1F2937, #374151);
                    color: white;
                    padding: 15px 20px;
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .day-content {
                    padding: 20px;
                    background: #FAFAFA;
                }
                
                .day-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                }
                
                .day-description {
                    font-size: 14px;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                
                .themes {
                    margin-bottom: 10px;
                }
                
                .themes strong {
                    color: #D97706;
                }
                
                .accommodation {
                    background: #EFF6FF;
                    padding: 10px;
                    border-radius: 6px;
                    border-left: 4px solid #3B82F6;
                    font-size: 13px;
                }
                
                .accommodation strong {
                    color: #1D4ED8;
                }
                
                .section-title {
                    background: #D97706;
                    color: white;
                    padding: 15px 20px;
                    font-size: 18px;
                    font-weight: bold;
                    margin: 30px 0 20px 0;
                    border-radius: 6px;
                }
                
                .inclusions-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 25px;
                }
                
                .inclusions, .exclusions {
                    background: #F9FAFB;
                    padding: 15px;
                    border-radius: 6px;
                    border: 1px solid #E5E7EB;
                }
                
                .inclusions h4 {
                    color: #059669;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .exclusions h4 {
                    color: #DC2626;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .inclusions ul, .exclusions ul {
                    list-style: none;
                    padding: 0;
                }
                
                .inclusions li {
                    padding: 5px 0;
                    font-size: 13px;
                    position: relative;
                    padding-left: 20px;
                }
                
                .inclusions li:before {
                    content: "✓";
                    color: #059669;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }
                
                .exclusions li {
                    padding: 5px 0;
                    font-size: 13px;
                    position: relative;
                    padding-left: 20px;
                }
                
                .exclusions li:before {
                    content: "✗";
                    color: #DC2626;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                }
                
                .pricing-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .pricing-table th {
                    background: #D97706;
                    color: white;
                    padding: 15px;
                    text-align: center;
                    font-weight: bold;
                }
                
                .pricing-table td {
                    padding: 15px;
                    text-align: center;
                    border-bottom: 1px solid #E5E7EB;
                }
                
                .pricing-table .price {
                    font-size: 18px;
                    font-weight: bold;
                    color: #D97706;
                }
                
                .accommodation-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background: white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .accommodation-table th {
                    background: #1F2937;
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: bold;
                }
                
                .accommodation-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #E5E7EB;
                    font-size: 14px;
                }
                
                .terms-section {
                    background: #FEF3E2;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 25px 0;
                    border-left: 5px solid #D97706;
                }
                
                .terms-section h4 {
                    color: #92400E;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .terms-section ul {
                    font-size: 13px;
                    line-height: 1.6;
                    padding-left: 20px;
                }
                
                .terms-section li {
                    margin-bottom: 5px;
                }
                
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #D97706;
                }
                
                .footer h3 {
                    color: #D97706;
                    font-size: 20px;
                    margin-bottom: 10px;
                }
                
                .footer p {
                    color: #666;
                    font-size: 14px;
                }
                
                .client-info {
                    background: #EFF6FF;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    border-left: 4px solid #3B82F6;
                }
                
                .client-info h3 {
                    color: #1D4ED8;
                    margin-bottom: 10px;
                }
                
                .page-break {
                    page-break-before: always;
                }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div class="header">
                <h1>{{ package.duration }} {{ package.title }}</h1>
                <p class="subtitle">Kashmir, known as "Paradise on Earth," is a captivating destination with its snow-capped mountains, pristine landscapes, and rich cultural heritage.</p>
            </div>

            {% if client_info %}
            <!-- Client Information -->
            <div class="client-info">
                <h3>Prepared for: {{ client_info.name }}</h3>
                <p><strong>Email:</strong> {{ client_info.email }} | <strong>Phone:</strong> {{ client_info.phone }}</p>
                <p><strong>Travel Date:</strong> {{ client_info.travel_date }} | <strong>Travelers:</strong> {{ client_info.travelers }} people</p>
                <p><strong>Generated on:</strong> {{ generated_date }}</p>
            </div>
            {% endif %}

            <!-- Hero Image -->
            {% if package.image %}
            <img src="{{ package.image }}" alt="{{ package.title }}" class="hero-image">
            {% endif %}

            <!-- Package Overview -->
            <div class="package-overview">
                <h2>Package Overview</h2>
                <p>{{ package.description }}</p>
                <div class="package-details">
                    <div class="detail-item">
                        <div class="value">{{ package.duration }}</div>
                        <div class="label">Duration</div>
                    </div>
                    <div class="detail-item">
                        <div class="value">{{ package.groupSize }}</div>
                        <div class="label">Group Size</div>
                    </div>
                    <div class="detail-item">
                        <div class="value">₹{{ "{:,}".format(package.price) }}</div>
                        <div class="label">Price per Person</div>
                    </div>
                    <div class="detail-item">
                        <div class="value">{{ package.category|title }}</div>
                        <div class="label">Category</div>
                    </div>
                </div>
            </div>

            <!-- Day wise Itinerary -->
            <div class="section-title">Day wise Itinerary</div>
            
            {% for day in package.itinerary %}
            <div class="day-section">
                <div class="day-header">
                    Day {{ day.day }}: {{ day.title }}
                </div>
                <div class="day-content">
                    {% if day.image %}
                    <img src="{{ day.image }}" alt="Day {{ day.day }}" class="day-image">
                    {% endif %}
                    
                    <div class="day-description">
                        {{ day.description }}
                    </div>
                    
                    {% if day.activities %}
                    <div class="themes">
                        <strong>Themes:</strong> {{ day.activities|join(', ') }}
                    </div>
                    {% endif %}
                    
                    {% if day.accommodation %}
                    <div class="accommodation">
                        <strong>Accommodation:</strong> {{ day.accommodation }}
                    </div>
                    {% endif %}
                </div>
            </div>
            {% endfor %}

            <div class="page-break"></div>

            <!-- Inclusions & Exclusions -->
            <div class="section-title">Package Inclusions & Exclusions</div>
            <div class="inclusions-grid">
                <div class="inclusions">
                    <h4>✓ Inclusions</h4>
                    <ul>
                        {% for inclusion in package.inclusions %}
                        <li>{{ inclusion }}</li>
                        {% endfor %}
                    </ul>
                </div>
                
                <div class="exclusions">
                    <h4>✗ Exclusions</h4>
                    <ul>
                        {% for exclusion in package.exclusions %}
                        <li>{{ exclusion }}</li>
                        {% endfor %}
                    </ul>
                </div>
            </div>

            <!-- Pricing -->
            <div class="section-title">Price & Rates</div>
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th>No of Pax</th>
                        <th>Age Limit</th>
                        <th>Price per Pax (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ package.groupSize.split()[0] if package.groupSize else 'Multiple' }}</td>
                        <td>Above 12 years</td>
                        <td class="price">₹{{ "{:,}".format(package.price) }}</td>
                    </tr>
                </tbody>
            </table>
            <p style="font-style: italic; font-size: 12px; color: #666; margin-top: 10px;">
                * Mentioned prices may vary depending upon date of travel, hotel availability, surge pricing and seasonal rush.
            </p>

            <!-- Accommodation Details -->
            {% if accommodation_details %}
            <div class="section-title">Accommodation</div>
            <table class="accommodation-table">
                <thead>
                    <tr>
                        <th>City</th>
                        <th>Hotel Name</th>
                        <th>Star Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {% for acc in accommodation_details %}
                    <tr>
                        <td>{{ acc.city }}</td>
                        <td>{{ acc.hotel_name }}</td>
                        <td>{{ acc.star_rating }}</td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
            {% endif %}

            <!-- Terms & Conditions -->
            <div class="section-title">Terms & Conditions</div>
            
            <div class="terms-section">
                <h4>Payment Terms & Methods:</h4>
                <ul>
                    <li>20% Advance Percentage of total booking amount</li>
                    <li>Airfare/Transport fare to be paid full at one time in advance</li>
                </ul>
            </div>

            <div class="terms-section">
                <h4>Cancellation & Refund Policy:</h4>
                <ul>
                    <li>Upon cancellation, refund will be made after deducting the Retention Amount</li>
                    <li>Retention Amount varies as per the number of days left before your package start date</li>
                    <li>Refund will be made within 15 working days from the date of receipt of the cancellation</li>
                </ul>
            </div>

            <!-- Footer -->
            <div class="footer">
                <h3>G.M.B Tour And Travels</h3>
                <p>Experience Paradise on Earth - Kashmir</p>
                <p>Contact: +91 98765 43210 | Email: info@gmbtravelskashmir.com</p>
                <p>Srinagar, Kashmir, India</p>
            </div>
        </body>
        </html>
        """
        
        # Prepare template data
        template_data = {
            'package': package_data,
            'client_info': client_info,
            'generated_date': datetime.now().strftime('%B %d, %Y'),
            'accommodation_details': [
                {'city': 'Srinagar', 'hotel_name': 'Grand Retreat / Gurcoo Residency', 'star_rating': '⭐⭐⭐'},
                {'city': 'Pahalgam', 'hotel_name': 'Golden Heritage / Merilyn Resort', 'star_rating': '⭐⭐⭐'},
                {'city': 'Gulmarg', 'hotel_name': 'Highlands Park / Nedous Hotel', 'star_rating': '⭐⭐⭐'}
            ]
        }
        
        # Render template
        template = Template(html_template)
        html_content = template.render(**template_data)
        
        # Generate PDF
        pdf_filename = f"package_{package_data['title'].replace(' ', '_').lower()}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = Path("uploads") / "pdfs"
        pdf_path.mkdir(exist_ok=True)
        
        full_pdf_path = pdf_path / pdf_filename
        
        # Create PDF with WeasyPrint
        html_doc = HTML(string=html_content, base_url=".")
        html_doc.write_pdf(str(full_pdf_path))
        
        return {
            'filename': pdf_filename,
            'filepath': str(full_pdf_path),
            'url': f'/uploads/pdfs/{pdf_filename}',
            'size': os.path.getsize(full_pdf_path)
        }

# Sample usage function
def generate_sample_pdf():
    """Generate a sample PDF for testing"""
    
    sample_package = {
        'title': '7 Days Spiritual Journey Of Kashmir Tour',
        'duration': '7 Days 6 Nights',
        'description': 'Complete Kashmir experience covering Srinagar, Gulmarg, Pahalgam, and Sonamarg with spiritual and cultural immersion.',
        'price': 25000,
        'groupSize': '6 People',
        'category': 'spiritual',
        'image': 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/u2wmxitn_pexels-abhilash-mishra-1539700.jpg',
        'itinerary': [
            {
                'day': 1,
                'title': 'Arrival at Jammu Railway & Transfer to Srinagar',
                'description': 'You will be greeted and assisted by G.M.B Tour & Travels representative who would assist with your transfer to Srinagar Hotel to have rest there Check in & get freshen up.',
                'activities': ['Adventure', 'Sightseeing', 'Boating'],
                'accommodation': 'Grand Retreat / Gurcoo Residency / Seven Hill Star [3 Star]',
                'image': 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/bm97gdwu_pexels-azam-khan-12040331.jpg'
            },
            {
                'day': 2,
                'title': 'Day Trip to Gulmarg',
                'description': 'This Morning after breakfast proceed for an adventurous trip to Gulmarg. Situated at an average elevation of 2690m. Gulmarg is easily one of the premier hill Resort of India. Gulmarg tourism is all about witnessing the scenic beauty of the snow-capped mountains.',
                'activities': ['Mountaineering', 'Skiing', 'Gondola Ride'],
                'accommodation': 'Grand Retreat / Gurcoo Residency / Seven Hill Star [3 Star]',
                'image': 'https://customer-assets.emergentagent.com/job_gmb-tours/artifacts/rudsgdbz_pexels-azeen-shah-10542627.jpg'
            }
        ],
        'inclusions': [
            'MAP (Room + Breakfast + Lunch/Dinner)',
            'Hotel Accommodation',
            'Sightseeing as per itinerary',
            'Transfers by Private Vehicle',
            'Pickup and Drop',
            'Welcome Drink',
            'Mineral Water',
            'Professional Guide'
        ],
        'exclusions': [
            'Expenses of personal nature such as tips, laundry, telephone & table drinks etc.',
            'Internal Airfare',
            'Garden entrance fee Rs 30-50 per person per garden',
            'Pony Ride in Gulmarg/Pahalgam/Sonamarg Rs. 850 – 1500 depend on place',
            'Cable Car rides in Gulmarg. Phase I Rs. 750 & Phase II Rs. 950',
            'GST / TAXES'
        ]
    }
    
    sample_client = {
        'name': 'Rajesh Kumar',
        'email': 'rajesh.kumar@email.com',
        'phone': '+91 98765 43210',
        'travel_date': 'December 15, 2024',
        'travelers': 4
    }
    
    generator = PackagePDFGenerator()
    return generator.create_package_pdf(sample_package, sample_client)

if __name__ == "__main__":
    # Test the PDF generator
    result = generate_sample_pdf()
    print(f"PDF generated successfully: {result['url']}")