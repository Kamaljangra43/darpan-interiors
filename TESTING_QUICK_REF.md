# Quick Testing Reference Card

## 🚀 Start Testing in 3 Steps

### Step 1: Start Development Server

```bash
cd frontend
npm run dev
```

Server should start at http://localhost:3000

### Step 2: Login to Admin Dashboard

```
URL: http://localhost:3000/admin/login
```

Use your admin credentials

### Step 3: Test Featured Images

```
Click "Edit" on any project → See new featured image interface
```

---

## ✅ Quick Feature Checklist

### Visual Elements to Verify

- [ ] **Featured Summary Panel** appears at top (blue background)
- [ ] **Featured Count** shows correct number: "X images selected for featured slideshow"
- [ ] **Warning Message** shows when count is 0: "⚠️ No featured images selected..."
- [ ] **Order Badges** show #1, #2, #3... on all images (top-left corner)
- [ ] **Main Badge** shows "MAIN" on first image only (top-right)
- [ ] **Featured Badges** show gold "⭐ Featured" on featured images (bottom-left)
- [ ] **Remove Buttons** show red X on all images (top-right)

### Interactive Elements to Test

- [ ] **Hover over image** → Overlay appears with featured checkbox
- [ ] **Click checkbox** → Featured status toggles
- [ ] **Toggle ON** → Gold featured badge appears immediately
- [ ] **Toggle OFF** → Featured badge disappears immediately
- [ ] **Featured count updates** in summary panel after toggle
- [ ] **Click remove button** → Image removes from grid
- [ ] **Remove featured image** → Featured count decreases

### Upload New Images

- [ ] **Click "Add images" input** at bottom
- [ ] **Select multiple images** (e.g., 3-5 images)
- [ ] **New images appear** in grid with order badges
- [ ] **If no featured images exist** → First 3 auto-marked as featured
- [ ] **If featured images exist** → New images NOT auto-featured
- [ ] **Can manually mark** new images as featured via hover checkbox

### Save & Verify

- [ ] **Click "Update Project"** button
- [ ] **Success message** appears
- [ ] **Re-open project** → Featured flags preserved
- [ ] **View project on frontend** → Featured slideshow shows correct images
- [ ] **Check complete gallery** → All images visible in manual gallery

---

## 🎯 Critical Test Scenarios

### Scenario 1: Edit Existing Project

**Steps:**

1. Click edit on any project
2. Verify current featured images show gold badges
3. Toggle one featured image OFF
4. Toggle one non-featured image ON
5. Click Update Project
6. Re-open project
7. Verify changes persisted

**Expected:** Featured status updates and saves correctly

---

### Scenario 2: Add Images to Empty Project

**Steps:**

1. Create new project (or edit project with no images)
2. Upload 5 images via file input
3. Check featured count

**Expected:** First 3 images auto-featured, count shows "3 images selected"

---

### Scenario 3: Add Images to Project with Featured

**Steps:**

1. Edit project with 2 featured images
2. Upload 3 new images
3. Check featured status of new images

**Expected:** New images NOT auto-featured, count stays at 2

---

### Scenario 4: Remove Featured Image

**Steps:**

1. Edit project with 3 featured images
2. Click remove button on one featured image
3. Check featured count

**Expected:** Count decreases to 2, summary updates immediately

---

### Scenario 5: Clear All Featured

**Steps:**

1. Edit project with featured images
2. Uncheck all featured checkboxes
3. Check summary panel

**Expected:** Warning shows "⚠️ No featured images selected. First 5 will be shown by default."

---

### Scenario 6: Frontend Display

**Steps:**

1. Edit project, mark 4 images as featured
2. Save project
3. Open project detail on frontend
4. Check featured slideshow

**Expected:** Only 4 featured images show in auto-playing slideshow

---

## 🐛 Common Issues & Quick Fixes

### Issue: Featured badges not showing

**Check:**

- Open browser console for errors
- Verify `img.featured === true` (not string "true")
- Check Star icon import

**Fix:** Clear browser cache, refresh page

---

### Issue: Checkbox not toggling

**Check:**

- Console errors for `toggleFeaturedImage`
- State updates in React DevTools

**Fix:** Verify function is defined before JSX section

---

### Issue: Featured count not updating

**Check:**

- `editProjectImages` state in React DevTools
- Filter logic: `.filter(img => img.featured).length`

**Fix:** Ensure `toggleFeaturedImage` updates state correctly

---

### Issue: Featured flags not saving

**Check:**

- Network tab: Verify API payload includes featured flags
- Backend logs: Check if controller receives data

**Fix:** Verify `handleUpdateProject` sends full image objects

---

### Issue: Auto-feature not working

**Check:**

- `currentFeaturedCount` calculation
- Logic: `index < 3` condition

**Fix:** Log `newImages` array before `setState`

---

## 📊 Testing Data Examples

### Test Project 1: Minimal (3 images)

```json
{
  "title": "Modern Living Room",
  "images": [
    { "url": "img1.jpg", "featured": true, "order": 0 },
    { "url": "img2.jpg", "featured": true, "order": 1 },
    { "url": "img3.jpg", "featured": false, "order": 2 }
  ]
}
```

**Expected:** Featured count = 2, first 2 have badges

---

### Test Project 2: Many Images (8 images)

```json
{
  "title": "Luxury Apartment",
  "images": [
    { "url": "img1.jpg", "featured": true, "order": 0 },
    { "url": "img2.jpg", "featured": false, "order": 1 },
    { "url": "img3.jpg", "featured": true, "order": 2 },
    { "url": "img4.jpg", "featured": false, "order": 3 },
    { "url": "img5.jpg", "featured": true, "order": 4 },
    { "url": "img6.jpg", "featured": false, "order": 5 },
    { "url": "img7.jpg", "featured": true, "order": 6 },
    { "url": "img8.jpg", "featured": false, "order": 7 }
  ]
}
```

**Expected:** Featured count = 4, slideshow shows only 4 images

---

### Test Project 3: No Featured (Legacy)

```json
{
  "title": "Classic Kitchen",
  "images": ["img1.jpg", "img2.jpg", "img3.jpg", "img4.jpg", "img5.jpg"]
}
```

**Expected:** Auto-converts to objects, warning shows, first 5 in slideshow

---

## 🎨 Visual Verification

### Color Check (Light Mode)

- **Summary Panel**: Blue background (bg-blue-50), blue border
- **Featured Badge**: Gold gradient (amber-500 to amber-600)
- **Order Badge**: Black semi-transparent (black/70)
- **Main Badge**: Solid amber (amber-600)
- **Remove Button**: Red (red-600), darker on hover (red-700)

### Color Check (Dark Mode)

- **Summary Panel**: Dark blue transparent (blue-900/20), darker border
- **Checkbox Background**: Dark gray (gray-800/95)
- **Image Borders**: Dark gray (gray-700)

### Typography Check

- **Labels**: Small, medium weight (text-sm font-medium)
- **Badges**: Extra small, semibold (text-xs font-semibold)
- **Count**: Small, medium weight (text-sm font-medium)
- **Warning**: Extra small, amber color (text-xs text-amber-600)

---

## 📱 Browser Testing

### Desktop Browsers

- [ ] Chrome (Windows/Mac)
- [ ] Firefox
- [ ] Safari (Mac only)
- [ ] Edge

### Mobile Browsers (Optional)

- [ ] Chrome Mobile
- [ ] Safari iOS

### Screen Sizes

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667) - May need future optimization

---

## ⚡ Performance Check

### Load Times

- [ ] **Grid renders** < 500ms
- [ ] **Hover overlay** transitions smoothly
- [ ] **Checkbox toggle** responds instantly
- [ ] **No lag** when toggling multiple images

### Image Loading

- [ ] **Images load progressively** (Next.js optimization)
- [ ] **No layout shift** during image load
- [ ] **Aspect ratio maintained** (square)

---

## 🔍 Accessibility Check

### Keyboard Navigation

- [ ] **Tab key** cycles through images
- [ ] **Space/Enter** toggles checkbox
- [ ] **Focus indicator** visible on checkbox

### Screen Reader

- [ ] **Alt text** present on all images
- [ ] **Button labels** readable ("Remove image")
- [ ] **Checkbox labels** readable ("Featured")

---

## 📸 Screenshot Locations

### For Bug Reports, Capture:

1. **Edit Modal Overview** - Full modal with featured section
2. **Featured Summary** - Close-up of blue summary panel
3. **Image Grid** - 4-column grid with badges
4. **Hover State** - Image with checkbox overlay visible
5. **Featured Badge** - Close-up of gold featured badge
6. **Dark Mode** - Same views in dark mode

---

## 💾 State Debugging

### React DevTools

Check these states in Components tab:

```
AdminDashboard
  ├─ editProjectImages: Array(N)
  │   └─ [0]: { url: "...", featured: true, order: 0 }
  └─ editProjectData
      └─ images: Array(N)
```

### Console Logging

Add temporary logs if needed:

```typescript
console.log(
  "Featured count:",
  editProjectImages.filter((img) => img.featured).length
);
console.log("Edit project images:", editProjectImages);
console.log("Toggle featured:", index, featured);
```

---

## ✨ Success Criteria

### Admin Interface

- ✅ All visual elements render correctly
- ✅ Interactive elements respond smoothly
- ✅ State updates immediately on user action
- ✅ Featured count always accurate
- ✅ Dark mode looks professional
- ✅ No console errors or warnings

### Data Persistence

- ✅ Featured flags save to database
- ✅ Flags load correctly on project edit
- ✅ Order values preserved
- ✅ Image URLs unchanged
- ✅ Backward compatible with old data

### Frontend Integration

- ✅ Featured slideshow shows correct images
- ✅ Auto-play works smoothly
- ✅ Complete gallery shows all images
- ✅ Fallback to first 5 works if no featured
- ✅ Image viewer modal opens correctly

---

## 🎓 Testing Tips

1. **Test incrementally** - One feature at a time
2. **Use React DevTools** - Monitor state changes
3. **Check Network tab** - Verify API payloads
4. **Test edge cases** - Empty, 1 image, 100 images
5. **Toggle featured repeatedly** - Verify consistency
6. **Clear cache** if seeing stale data
7. **Test in both light and dark mode**
8. **Verify mobile responsiveness** (optional for now)

---

## 📞 Report Issues

If you find bugs, note:

1. **Exact steps** to reproduce
2. **Expected behavior** vs actual behavior
3. **Browser** and version
4. **Screenshots** of issue
5. **Console errors** (if any)
6. **Network payload** (if save issue)

---

**Last Updated**: January 2025  
**Testing Version**: 2.0 (Featured Images)  
**Status**: Ready for QA
