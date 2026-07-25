import React, { useState } from 'react';
import { Network, Send, CheckCircle2, Building, Globe } from 'lucide-react';
import { Input, Textarea } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function DistributorNetwork() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    city: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email Address is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact Number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <div className="pt-36 pb-24 bg-[#FFF8F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-black uppercase tracking-wider shadow-xs">
            <Network className="w-3.5 h-3.5" /> B2B Partner Network
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
            Distributor <span className="text-sky-600">Network</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            Partner with Jog&Joy to expand your wholesale apparel distribution with competitive margins, high consumer demand, and fast stock supply.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Info Card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              <h3 className="text-2xl font-black text-slate-900">Why Partner With Us?</h3>
              
              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>High consumer demand across Kids & Men activewear segments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Exclusive regional distribution rights for qualified partners.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>High-volume production capacity with rapid fulfillment.</span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-600" />
                  <span>Dharmnath Products / Jog&Joy HQ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Kalupur, Ahmedabad 380001, Gujarat, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-md">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Distributor Application Form</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <Input
                  label="Contact Number"
                  name="contactNumber"
                  placeholder="+91 98765 43210"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  error={errors.contactNumber}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Address"
                  name="address"
                  placeholder="123 Commercial Street"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                />
                <Input
                  label="City"
                  name="city"
                  placeholder="Ahmedabad"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />
              </div>

              <Textarea
                label="Message / Business Profile"
                name="message"
                placeholder="Tell us about your retail network and wholesale distribution history..."
                value={formData.message}
                onChange={handleChange}
              />

              <Button type="submit" variant="sky" size="lg" icon={Send} className="w-full sm:w-auto">
                Submit Distributor Application
              </Button>
            </form>
          </div>

        </div>

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ firstName: '', lastName: '', email: '', contactNumber: '', address: '', city: '', message: '' });
        }}
        title="Application Received!"
        message={`Thank you, ${formData.firstName}! Your distributor network application has been submitted to the Jog&Joy team. We will review your profile and contact you shortly.`}
      />
    </div>
  );
}
