# ✅ FIXED: Buttons Now Visible in Global Header!

## What You'll See Now

When you go to **Academic Writing** screen, look at the very top **Global Header** bar:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Academic Writing > Generic                                                │
│                                                                            │
│  Target Journal: [Generic Medical Journal (Generic) ▼] [+]  [Audit] ...  │
│                                                       ↑                    │
│                                                       └─ Plus button HERE  │
└────────────────────────────────────────────────────────────────────────────┘
```

### When Generic is Selected:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Target Journal: [Generic Medical Journal ▼] [+] [⚙️]  [Audit] [Co-Pilot] │
│                                               ↑   ↑                        │
│                                               │   └─ Settings (Edit Generic)
│                                               └───── Plus (Create Custom)  │
└────────────────────────────────────────────────────────────────────────────┘
```

## Two Buttons:

1. **[+] Button (Blue Plus Icon)**
   - Always visible next to journal dropdown
   - Opens "Create Custom Journal" dialog
   - Color: Blue
   - Hover: Light blue background

2. **[⚙️] Button (Purple Settings Icon)**
   - **ONLY visible when Generic is selected**
   - Opens "Edit Generic Journal Defaults" dialog
   - Color: Purple
   - Hover: Light purple background

## Important Note:

The **Settings [⚙️] button ONLY appears when you have "Generic Academic Journal" selected** in the dropdown. 

If you select Lancet, NEJM, or any other journal, the settings button will hide (because those journals have fixed constraints).

## To See the Settings Button:

1. Go to **Academic Writing** (in left navigation)
2. Look at the **top header bar** (Global Header)
3. Find the "Target Journal" dropdown
4. Select **"Generic Academic Journal"** from the dropdown
5. ✅ The **[⚙️] settings button** will appear to the right of the [+] button

## Screenshot Guide:

```
Before (any journal):
Target Journal: [Lancet ▼] [+]

After (Generic selected):
Target Journal: [Generic ▼] [+] [⚙️]
                                 ↑
                                 Settings appears!
```

---

**The buttons are now in the code and should be visible!** 🎉

Try it:
1. Navigate to Academic Writing
2. Select "Generic" from dropdown
3. You'll see [+] and [⚙️] buttons appear!
