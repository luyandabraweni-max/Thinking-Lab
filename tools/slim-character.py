# Blender script: keep only the Idle and Wave animations of a character and export a compact .glb.
# Usage: /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P tools/slim-character.py -- in.gltf assets/3d/out.glb
import bpy, sys
src, out = sys.argv[sys.argv.index("--") + 1:][:2]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
KEEP = {"Idle", "Wave"}
for ob in bpy.data.objects:
    ad = ob.animation_data
    if ad:
        for t in list(ad.nla_tracks):
            ad.nla_tracks.remove(t)
        ad.action = None
for a in list(bpy.data.actions):
    base = a.name.split("|")[-1].split(".")[0]
    if base not in KEEP and a.name not in KEEP:
        bpy.data.actions.remove(a)
    else:
        a.use_fake_user = True
print("KEPT", [a.name for a in bpy.data.actions])
bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_animations=True, export_animation_mode="ACTIONS", export_yup=True, export_apply=False)
