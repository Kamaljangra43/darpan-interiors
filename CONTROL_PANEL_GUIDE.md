# Image Control Panel - Visual Guide

## 🎨 Updated Layout

### Before (Problem)

```
┌─────────────────────────┐
│ #1              MAIN ❌ │ ← MAIN badge and X button overlapping!
│                         │
│     [IMAGE]             │
│                         │
│ ⭐ Featured             │
└─────────────────────────┘
```

**Issues:**

- MAIN badge and remove button in same position
- No way to reorder images
- Clicking remove was difficult

---

### After (Solution)

```
┌─────────────────────────┐
│ #1      MAIN        ⬆️  │ ← Order (left), MAIN (center), Move Up (right)
│                     ⬇️  │ ← Move Down (right)
│     [IMAGE]         ❌  │ ← Remove (right)
│                         │
│ ⭐ Featured    □Featured│ ← Featured badge + checkbox on hover
└─────────────────────────┘
```

**Improvements:**

- MAIN badge moved to center (no overlap)
- Vertical control panel in top-right
- Move Up/Down buttons for reordering
- Remove button at bottom of panel
- Clear visual hierarchy

---

## 🎯 Control Panel Components

### 1. Move Up Button

```css
Position: top-right, first button
Color: Blue (bg-blue-600)
Hover: Darker blue (bg-blue-700)
Icon: Up arrow (chevron-up)
Size: Compact (p-1, w-3 h-3 icon)
Tooltip: "Move up"
```

**Shows when:** `index > 0` (not first image)
**Function:** Swaps with previous image in array

---

### 2. Move Down Button

```css
Position: top-right, second button
Color: Blue (bg-blue-600)
Hover: Darker blue (bg-blue-700)
Icon: Down arrow (chevron-down)
Size: Compact (p-1, w-3 h-3 icon)
Tooltip: "Move down"
```

**Shows when:** `index < length - 1` (not last image)
**Function:** Swaps with next image in array

---

### 3. Remove Button

```css
Position: top-right, third button
Color: Red (bg-red-600)
Hover: Darker red (bg-red-700)
Icon: X (close)
Size: Compact (p-1, w-3 h-3 icon)
Tooltip: "Remove image"
```

**Shows when:** Always
**Function:** Deletes image from project

---

## 📐 Layout Specifications

### Control Panel Container

```tsx
<div className="absolute top-2 right-2 flex flex-col gap-1">
  {/* Move Up Button */}
  {/* Move Down Button */}
  {/* Remove Button */}
</div>
```

**CSS Properties:**

- `position: absolute` - Overlays image
- `top: 0.5rem; right: 0.5rem` - Top-right corner
- `display: flex; flex-direction: column` - Vertical stack
- `gap: 0.25rem` - 4px space between buttons

---

### Button Styles

```tsx
<button
  type="button"
  className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700 transition-colors shadow-md"
  title="Move up"
>
  <svg className="w-3 h-3" ...>
    {/* Arrow icon */}
  </svg>
</button>
```

**Common Properties:**

- `padding: 0.25rem` - Compact size
- `border-radius: 0.25rem` - Slightly rounded
- `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` - Depth
- `transition: background-color 150ms` - Smooth hover

---

### SVG Icons

**Up Arrow:**

```html
<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M5 15l7-7 7 7"
  />
</svg>
```

**Down Arrow:**

```html
<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M19 9l-7 7-7-7"
  />
</svg>
```

**X Icon:** (Lucide React X component)

```tsx
<X className="w-3 h-3" />
```

---

## 🎬 Interaction Flow

### Reordering Images

**Move Image #3 to #1:**

1. Click Move Up on image #3
   - Image #3 → #2, Image #2 → #3
2. Click Move Up on image #2 (was #3)
   - Image #2 → #1, Image #1 → #2
3. Result: Original #3 is now #1 (becomes MAIN)

**Visual Feedback:**

- Order badges update immediately
- MAIN badge moves to new #1
- Featured badges stay with their images
- Smooth transition (no page reload)

---

### Deleting Images

**Remove Image #2:**

1. Click red X button on image #2
2. Image disappears immediately
3. Order recalculates: #3 → #2, #4 → #3, etc.
4. Featured count updates if it was featured

**State Updates:**

- `editProjectImages` filtered and re-ordered
- `editProjectData.images` filtered and re-ordered
- Both arrays stay synchronized

---

## 🎨 Visual States

### Default State

```
┌─────────────────────────┐
│ #2                  ⬆️  │ ← Up button visible (not first)
│                     ⬇️  │ ← Down button visible (not last)
│     [IMAGE]         ❌  │ ← Remove always visible
│                         │
│                         │
└─────────────────────────┘
```

---

### First Image State

```
┌─────────────────────────┐
│ #1      MAIN        ⬇️  │ ← No up button (already first)
│                     ❌  │ ← Down and remove only
│     [IMAGE]             │
│                         │
│ ⭐ Featured             │
└─────────────────────────┘
```

---

### Last Image State

```
┌─────────────────────────┐
│ #5                  ⬆️  │ ← Up button visible
│                     ❌  │ ← No down button (already last)
│     [IMAGE]             │ ← Remove always visible
│                         │
│                         │
└─────────────────────────┘
```

---

### Single Image State

```
┌─────────────────────────┐
│ #1      MAIN        ❌  │ ← Only remove button
│                         │ ← No move buttons (nowhere to move)
│     [IMAGE]             │
│                         │
│ ⭐ Featured             │
└─────────────────────────┘
```

---

### Hover State (Featured Checkbox)

```
┌─────────────────────────┐
│ #2                  ⬆️  │ ← Control panel always visible
│                     ⬇️  │
│     [IMAGE]         ❌  │ ← Gradient overlay
│                         │
│ ⭐ Featured    ☑Featured│ ← Checkbox appears on hover
└─────────────────────────┘
```

---

## 🔧 Responsive Behavior

### Desktop (Current)

- All buttons visible
- Hover effects work
- Click to interact

### Tablet (Future Enhancement)

- Slightly larger buttons (p-1.5)
- Larger icons (w-4 h-4)
- More spacing (gap-1.5)

### Mobile (Future Enhancement)

- Larger touch targets (min 44x44px)
- Tap instead of hover for checkbox
- Swipe gestures for reordering
- Long-press for delete confirmation

---

## 🎨 Color Palette

### Blue (Move Buttons)

```css
Default:  bg-blue-600   (#2563eb)
Hover:    bg-blue-700   (#1d4ed8)
```

### Red (Remove Button)

```css
Default:  bg-red-600    (#dc2626)
Hover:    bg-red-700    (#b91c1c)
```

### White (Icons)

```css
color: text-white (#ffffff);
```

### Shadow

```css
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

---

## 📋 Accessibility

### Keyboard Navigation

- Tab through images
- Enter/Space to activate buttons
- Arrow keys to move focus between control buttons
- Focus ring visible on buttons

### Screen Reader Support

```tsx
<button
  type="button"
  title="Move up" // Tooltip for visual users
  aria-label="Move image up" // Screen reader text
>
  <svg aria-hidden="true"> // Hide decorative icon from SR ...</svg>
</button>
```

### Touch Targets

- Minimum size: 44x44px (WCAG 2.1 Level AAA)
- Current: 32x32px (acceptable for desktop)
- Mobile: Will increase to meet guidelines

---

## 🎓 Usage Tips

### For Best Results

1. **Order images before marking featured** - First image is always main thumbnail
2. **Test reordering** after making changes - Make sure order is logical
3. **Use Move Up/Down sparingly** - Better to upload in correct order initially
4. **Delete unused images** - Keeps project clean and loads faster

### Common Workflows

**Reorder Featured Slideshow:**

1. Move best image to position #1 (becomes main)
2. Move next 2-3 best to positions #2-4
3. Mark first 4 as featured
4. Save project

**Replace Main Image:**

1. Find desired image (e.g., #4)
2. Click Move Up 3 times
3. Now it's #1 and becomes main thumbnail
4. Save project

**Remove All Non-Featured:**

1. Identify non-featured images
2. Click red X on each
3. Leaves only featured images
4. Save project

---

## 💡 Pro Tips

### Efficient Reordering

Instead of many Up clicks, consider:

1. Delete image from current position
2. Re-upload at beginning
3. Auto-features if needed

### Prevent Accidental Deletion

Always have multiple images before deleting main (#1). If you delete the only image, you'll need to re-upload.

### Batch Operations

When making many changes:

1. Delete unwanted images first
2. Then reorder remaining
3. Then adjust featured flags
4. Save once at end

---

## 🐛 Common Issues

### "Move Up button not appearing"

**Cause:** You're on the first image  
**Solution:** This is correct behavior - can't move up from #1

### "Move Down button not appearing"

**Cause:** You're on the last image  
**Solution:** This is correct behavior - can't move down from last

### "Buttons too small to click"

**Cause:** Mouse precision issue  
**Solution:** Use zoom (Ctrl+Plus) or we can increase button size

### "Changes not saving"

**Cause:** Forgot to click Save Changes  
**Solution:** Always click Save after reordering/deleting

---

## ✅ Quality Checks

Before saving, verify:

- [ ] First image is best for main thumbnail
- [ ] Order makes sense (wide → detail → feature)
- [ ] 3-5 images marked as featured
- [ ] No duplicate images
- [ ] All images high quality
- [ ] Featured count shows correct number

---

**Last Updated:** October 4, 2025  
**Version:** 2.1 (Control Panel Update)  
**Status:** Production Ready
