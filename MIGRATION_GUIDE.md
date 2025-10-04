# Migration Guide: Project Image Structure Update

## 🎯 Overview

The project model has been updated to use a simplified, more efficient structure for managing images with featured flags.

---

## 📋 What Changed

### **Old Structure (Multiple Formats):**

```javascript
{
  image: "main.jpg",
  images: ["img1.jpg", "img2.jpg"], // Simple strings
  // OR
  images: [{ url: "img1.jpg", public_id: "...", featured: true }],
  // OR
  featuredImages: ["img1.jpg"],
  allImages: ["img1.jpg", "img2.jpg"]
}
```

### **New Structure (Unified):**

```javascript
{
  image: "main.jpg", // Main thumbnail
  images: [
    { url: "img1.jpg", featured: true, order: 0 },
    { url: "img2.jpg", featured: true, order: 1 },
    { url: "img3.jpg", featured: false, order: 2 }
  ]
}
```

---

## 🔄 Migration Steps

### **Option 1: Manual Update via Admin Panel**

1. **Edit Each Project:**
   - Open project in admin panel
   - Check featured boxes for 3-5 best images
   - Reorder images if needed
   - Save changes

### **Option 2: Database Migration Script**

Create a migration script to update existing data:

```javascript
// migrate-projects.js
const mongoose = require("mongoose");
const Project = require("./backend/models/projectModel");

async function migrateProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database...");

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to migrate`);

    for (const project of projects) {
      let needsUpdate = false;
      let newImages = [];

      // Case 1: Simple string array
      if (
        Array.isArray(project.images) &&
        project.images.length > 0 &&
        typeof project.images[0] === "string"
      ) {
        console.log(`Migrating project: ${project.title}`);
        newImages = project.images.map((url, index) => ({
          url: url,
          featured: index < 5, // First 5 as featured
          order: index,
        }));
        needsUpdate = true;
      }

      // Case 2: Objects without order field
      else if (
        Array.isArray(project.images) &&
        project.images.length > 0 &&
        typeof project.images[0] === "object" &&
        project.images[0].order === undefined
      ) {
        console.log(`Adding order to project: ${project.title}`);
        newImages = project.images.map((img, index) => ({
          url: img.url || img,
          featured: img.featured || index < 5,
          order: index,
        }));
        needsUpdate = true;
      }

      // Case 3: Separate featuredImages/allImages arrays
      else if (project.featuredImages || project.allImages) {
        console.log(`Converting separate arrays for: ${project.title}`);
        const featured = project.featuredImages || [];
        const all = project.allImages || project.images || [];

        newImages = all.map((url, index) => ({
          url: url,
          featured: featured.includes(url),
          order: index,
        }));

        // Clean up old fields
        project.featuredImages = undefined;
        project.allImages = undefined;
        needsUpdate = true;
      }

      if (needsUpdate) {
        project.images = newImages;
        await project.save();
        console.log(`✅ Migrated: ${project.title}`);
      }
    }

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateProjects();
```

**Run the migration:**

```bash
node migrate-projects.js
```

---

## 📝 Updating Controllers

### **Create Project (Controller Update):**

```javascript
const createProject = async (req, res) => {
  try {
    const { title, category, description, images, ...otherFields } = req.body;

    // Convert uploaded images to proper format
    const formattedImages = images.map((img, index) => ({
      url: img.url || img,
      featured: img.featured || false,
      order: img.order ?? index,
    }));

    const project = await Project.create({
      title,
      category,
      description,
      images: formattedImages,
      ...otherFields,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### **Update Project (Controller Update):**

```javascript
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, ...updateData } = req.body;

    // Format images if provided
    if (images) {
      updateData.images = images.map((img, index) => ({
        url: img.url || img,
        featured: img.featured || false,
        order: img.order ?? index,
      }));
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 🎨 Frontend Admin Panel Updates

### **Image Upload Component:**

```tsx
// Admin: Upload images with featured flag
interface ImageUpload {
  url: string;
  featured: boolean;
  order: number;
}

function ProjectImageManager({ images, onChange }) {
  const [projectImages, setProjectImages] = useState<ImageUpload[]>(
    images || []
  );

  const handleFileUpload = async (files: FileList) => {
    const newImages = await Promise.all(
      Array.from(files).map(async (file, index) => {
        const base64 = await convertToBase64(file);
        return {
          url: base64,
          featured: false,
          order: projectImages.length + index,
        };
      })
    );

    setProjectImages([...projectImages, ...newImages]);
    onChange([...projectImages, ...newImages]);
  };

  const toggleFeatured = (index: number) => {
    const updated = [...projectImages];
    updated[index].featured = !updated[index].featured;
    setProjectImages(updated);
    onChange(updated);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const updated = [...projectImages];
    const [removed] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, removed);

    // Update order values
    updated.forEach((img, idx) => {
      img.order = idx;
    });

    setProjectImages(updated);
    onChange(updated);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />

      <div className="image-grid">
        {projectImages.map((img, index) => (
          <div key={index} className="image-item">
            <img src={img.url} alt={`Image ${index + 1}`} />

            <label>
              <input
                type="checkbox"
                checked={img.featured}
                onChange={() => toggleFeatured(index)}
              />
              Featured
            </label>

            <div className="order-controls">
              <button
                onClick={() => reorderImages(index, index - 1)}
                disabled={index === 0}
              >
                ↑
              </button>
              <span>Order: {img.order}</span>
              <button
                onClick={() => reorderImages(index, index + 1)}
                disabled={index === projectImages.length - 1}
              >
                ↓
              </button>
            </div>

            <button
              onClick={() => {
                const updated = projectImages.filter((_, i) => i !== index);
                setProjectImages(updated);
                onChange(updated);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Verification Checklist

After migration, verify:

- [ ] All projects load correctly in frontend
- [ ] Featured slideshow shows correct images
- [ ] Complete gallery shows all images
- [ ] Image order is preserved
- [ ] Featured flags are respected
- [ ] No console errors
- [ ] No missing images
- [ ] Admin panel can edit projects
- [ ] New projects can be created
- [ ] Images can be reordered

---

## 🔍 Testing Queries

### **Check Migration Status:**

```javascript
// Find projects with old format (strings)
db.projects
  .find({
    "images.0": { $type: "string" },
  })
  .count();

// Find projects with new format
db.projects
  .find({
    "images.0.url": { $exists: true },
  })
  .count();

// Find projects with featured images
db.projects
  .find({
    "images.featured": true,
  })
  .count();
```

### **Sample Data Verification:**

```javascript
// Get a sample project
db.projects.findOne({}, { title: 1, images: 1 })

// Expected output:
{
  "_id": ObjectId("..."),
  "title": "Modern Apartment",
  "images": [
    { "url": "...", "featured": true, "order": 0 },
    { "url": "...", "featured": true, "order": 1 },
    { "url": "...", "featured": false, "order": 2 }
  ]
}
```

---

## 🚨 Rollback Plan

If migration fails, you can rollback:

```javascript
// rollback-projects.js
async function rollback() {
  const projects = await Project.find({});

  for (const project of projects) {
    if (project.images && project.images[0]?.url) {
      // Convert back to simple strings
      project.images = project.images.map((img) => img.url);
      await project.save();
    }
  }
}
```

---

## 📊 Expected Results

After migration:

- **Before:** Mixed formats, inconsistent structure
- **After:** Unified format, clean structure
- **Featured Slideshow:** Shows images with `featured: true`
- **Complete Gallery:** Shows all images in order
- **Performance:** Same or better (no additional queries)

---

## 💡 Best Practices

1. **Backup First:** Always backup database before migration
2. **Test Locally:** Run migration on local/staging first
3. **Featured Count:** Mark 3-5 images as featured (ideal)
4. **Image Order:** Use order field for intentional sequencing
5. **Validation:** Check data after migration

---

## 🆘 Troubleshooting

### **Issue: Images not showing**

- Check if URLs are valid
- Verify images array structure
- Check browser console for errors

### **Issue: Featured slideshow empty**

- Ensure at least one image has `featured: true`
- Frontend falls back to first 5 if none marked

### **Issue: Order is wrong**

- Update order field for each image
- Use admin panel to reorder visually

---

## 📞 Support

For migration issues:

1. Check this guide first
2. Review console logs
3. Check database structure
4. Verify controller logic

---

## 🎉 Post-Migration

Once migration is complete:

- ✅ Simplified structure
- ✅ Better performance
- ✅ Easier maintenance
- ✅ Consistent data format
- ✅ Professional presentation
