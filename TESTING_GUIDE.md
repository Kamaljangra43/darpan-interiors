# Quick Testing Guide

## 🧪 Test Your Featured Images Implementation

---

## 1️⃣ Test Backend API

### **Start Backend Server:**

```bash
cd backend
npm run dev
```

### **Test Create Project:**

```bash
# Using curl or Postman
POST http://localhost:5000/api/projects
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Test Project",
  "description": "Testing featured images",
  "category": "Residential",
  "images": [
    "https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Image+1",
    "https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Image+2",
    "https://via.placeholder.com/800x600/45B7D1/FFFFFF?text=Image+3",
    "https://via.placeholder.com/800x600/FFA07A/FFFFFF?text=Image+4"
  ]
}
```

**Expected Response:**

```json
{
  "_id": "...",
  "title": "Test Project",
  "image": "https://via.placeholder.com/800x600/FF6B6B...",
  "images": [
    {
      "url": "https://via.placeholder.com/800x600/FF6B6B...",
      "featured": true,
      "order": 0
    },
    {
      "url": "https://via.placeholder.com/800x600/4ECDC4...",
      "featured": true,
      "order": 1
    },
    {
      "url": "https://via.placeholder.com/800x600/45B7D1...",
      "featured": true,
      "order": 2
    },
    {
      "url": "https://via.placeholder.com/800x600/FFA07A...",
      "featured": false,
      "order": 3
    }
  ]
}
```

✅ First 3 should have `featured: true`  
✅ All should have sequential `order`  
✅ First image set as main `image` field

---

### **Test Update Project:**

```bash
PUT http://localhost:5000/api/projects/:id
Content-Type: application/json

{
  "images": [
    {
      "url": "https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Image+1",
      "featured": true,
      "order": 0
    },
    {
      "url": "https://via.placeholder.com/800x600/NEW/FFFFFF?text=NEW",
      "featured": false,
      "order": 1
    }
  ]
}
```

✅ Featured flags should be preserved  
✅ Order should be maintained  
✅ New image added correctly

---

## 2️⃣ Test Frontend Context

### **Start Frontend Server:**

```bash
cd frontend
npm run dev
```

### **Open Browser Console:**

```
http://localhost:3000
```

### **Check Console for Normalization:**

Look for:

```
✅ Projects normalized: [...]
```

**Verify:**

- Old string arrays converted to objects
- Featured flags set correctly
- Order assigned properly

---

## 3️⃣ Test Project Detail Modal

### **Navigate to Projects:**

```
http://localhost:3000/#projects
```

### **Click on a Project:**

Opens project detail modal

### **Verify Featured Slideshow:**

- ✅ Shows only images with `featured: true`
- ✅ Auto-plays every 4 seconds
- ✅ Dot indicators work
- ✅ Manual navigation on hover
- ✅ Shows "X featured • Click to view all"

### **Verify Complete Gallery:**

- ✅ Shows all images
- ✅ Displays total count
- ✅ Navigation arrows work
- ✅ Progress counter updates
- ✅ Thumbnail strip highlights active
- ✅ Click opens lightbox

---

## 4️⃣ Browser DevTools Checks

### **Network Tab:**

```
1. Load projects page
2. Check API response
3. Verify image structure
```

**Look for:**

```json
{
  "images": [{ "url": "...", "featured": true, "order": 0 }]
}
```

### **React DevTools:**

```
1. Select ProjectDetailModal component
2. Check props
3. Verify featuredImages and allImages
```

**Should see:**

```typescript
featuredImages: ["url1", "url2", "url3"];
allImages: ["url1", "url2", "url3", "url4", "url5"];
```

---

## 5️⃣ Database Verification

### **MongoDB Compass or CLI:**

```bash
# Connect to database
mongo YOUR_DATABASE_URI

# Find a project
db.projects.findOne({ title: "Test Project" })
```

**Verify Structure:**

```json
{
  "images": [
    {
      "url": "...",
      "featured": true,
      "order": 0
    }
  ]
}
```

---

## 6️⃣ Test Scenarios

### **Scenario A: New Project**

1. Create project via API/Admin
2. Add 5 images
3. Check first 3 are featured
4. View in modal
5. Verify slideshow shows 3
6. Verify gallery shows 5

✅ **Pass if:** Slideshow has 3, gallery has 5

---

### **Scenario B: Update Featured**

1. Load existing project
2. Change featured flags
3. Update via API
4. Reload project
5. Verify featured slideshow updated

✅ **Pass if:** Only new featured images in slideshow

---

### **Scenario C: Reorder Images**

1. Load project
2. Change order values
3. Update via API
4. Reload project
5. Verify new order

✅ **Pass if:** Images display in new order

---

### **Scenario D: Legacy Data**

1. Create project with old format
2. Insert directly in DB:
   ```json
   {
     "images": ["url1.jpg", "url2.jpg"]
   }
   ```
3. Load in frontend
4. Check console for normalization
5. Verify display works

✅ **Pass if:** Old format converts and displays

---

## 7️⃣ Visual Testing

### **Featured Slideshow:**

- [ ] Auto-plays smoothly
- [ ] Transitions are smooth
- [ ] Dot indicators animate
- [ ] Hover shows controls
- [ ] Click opens lightbox
- [ ] Responsive on mobile

### **Complete Gallery:**

- [ ] Main viewer displays correctly
- [ ] Arrow navigation works
- [ ] Thumbnails scroll
- [ ] Active thumbnail highlighted
- [ ] Click opens lightbox
- [ ] Progress counter accurate

### **Dark Mode:**

- [ ] Slideshow colors correct
- [ ] Gallery colors correct
- [ ] Text readable
- [ ] Borders visible
- [ ] Hover states work

---

## 8️⃣ Performance Testing

### **Lighthouse Audit:**

```bash
# Run Lighthouse in Chrome DevTools
1. Open DevTools
2. Go to Lighthouse tab
3. Select categories
4. Run audit
```

**Target Scores:**

- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90

### **Network Performance:**

- [ ] Images load quickly
- [ ] No duplicate requests
- [ ] Proper caching
- [ ] Cloudinary optimization working

---

## 9️⃣ Error Handling

### **Test Error Cases:**

**No Images:**

```json
{
  "images": []
}
```

✅ Should fallback to main image

**Invalid Image URL:**

```json
{
  "images": [{ "url": "invalid", "featured": true }]
}
```

✅ Should show placeholder

**No Featured Images:**

```json
{
  "images": [{ "url": "img1.jpg", "featured": false }]
}
```

✅ Should use first 5 as featured

---

## 🔟 Integration Testing

### **Full Flow:**

1. **Admin uploads images**
2. **Images uploaded to Cloudinary**
3. **Project created with featured flags**
4. **Saved to database**
5. **Frontend fetches and normalizes**
6. **Modal displays correctly**
7. **Slideshow auto-plays featured**
8. **Gallery shows all images**

✅ **Pass if:** All steps complete without errors

---

## ⚠️ Common Issues & Solutions

### **Issue: Slideshow doesn't auto-play**

**Check:**

- `autoPlay` prop is true
- Featured images exist
- useEffect dependencies correct

**Solution:**

```typescript
autoPlay={true}
```

---

### **Issue: No images in gallery**

**Check:**

- `allImages` array has items
- Component receives props
- Console for errors

**Solution:**

```typescript
{
  allImages.length > 0 ? <Gallery /> : <NoImages />;
}
```

---

### **Issue: Featured flags not saving**

**Check:**

- Backend controller processes correctly
- Database schema matches
- API request format

**Solution:**

```javascript
// Ensure in controller
processedImages = images.map((url, index) => ({
  url,
  featured: index < 3,
  order: index,
}));
```

---

### **Issue: Old data not displaying**

**Check:**

- Context normalization function
- Type handling
- Console logs

**Solution:**

```typescript
// In context
if (typeof images[0] === "string") {
  // Convert to object format
}
```

---

## ✅ Final Checklist

### **Backend:**

- [ ] Server starts without errors
- [ ] Create project API works
- [ ] Update project API works
- [ ] Database saves correctly
- [ ] Featured flags set properly

### **Frontend:**

- [ ] App starts without errors
- [ ] Projects load successfully
- [ ] Context normalizes data
- [ ] Modal opens correctly
- [ ] No TypeScript errors

### **Features:**

- [ ] Featured slideshow works
- [ ] Auto-play functions
- [ ] Manual navigation works
- [ ] Complete gallery works
- [ ] Thumbnails clickable
- [ ] Lightbox opens
- [ ] Dark mode works
- [ ] Responsive design

### **Data:**

- [ ] New projects save correctly
- [ ] Updates preserve data
- [ ] Old data converts
- [ ] No data loss
- [ ] Order maintained

---

## 📊 Test Results Template

```
Test Date: _______________
Tester: _______________

Backend API:        [ ] Pass  [ ] Fail
Frontend Context:   [ ] Pass  [ ] Fail
Project Modal:      [ ] Pass  [ ] Fail
Featured Slideshow: [ ] Pass  [ ] Fail
Complete Gallery:   [ ] Pass  [ ] Fail
Dark Mode:          [ ] Pass  [ ] Fail
Performance:        [ ] Pass  [ ] Fail
Legacy Data:        [ ] Pass  [ ] Fail

Issues Found:
_________________________________
_________________________________

Notes:
_________________________________
_________________________________

Overall Status: [ ] Ready for Production  [ ] Needs Fixes
```

---

## 🎉 Success Criteria

Your implementation is successful if:

✅ All API endpoints work  
✅ Frontend displays correctly  
✅ Featured slideshow auto-plays  
✅ Complete gallery navigates  
✅ Old data still works  
✅ No console errors  
✅ Performance is good  
✅ Dark mode works  
✅ Responsive design  
✅ TypeScript compiles

---

## 📞 Support

If tests fail:

1. Check console for errors
2. Review implementation summary
3. Verify code matches examples
4. Check database structure
5. Test API endpoints individually

---

**Happy Testing! 🚀**
