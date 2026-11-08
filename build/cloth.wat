(module
 (type $0 (func (result i32)))
 (type $1 (func))
 (type $2 (func (param i32) (result f32)))
 (type $3 (func (result f32)))
 (type $4 (func (param f64) (result f64)))
 (type $5 (func (param i32 i32) (result i32)))
 (type $6 (func (param i32 i32 i32) (result i32)))
 (type $7 (func (param i32 i32 i32 i32)))
 (type $8 (func (param i64) (result i32)))
 (type $9 (func (param i32)))
 (type $10 (func (param f32 f32)))
 (type $11 (func (param f32 f32 f32 f32 i32)))
 (type $12 (func (param f32 f32 f32 f32 i32 f32 f32 f32 f32)))
 (type $13 (func (param i32 f32 f32 f32)))
 (type $14 (func (param i32 i32 f32 f32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $src/cloth/bufP (mut i32) (i32.const 0))
 (global $src/cloth/bufQ (mut i32) (i32.const 0))
 (global $src/cloth/bufN (mut i32) (i32.const 0))
 (global $src/cloth/bufIvm (mut i32) (i32.const 0))
 (global $src/cloth/bufUv (mut i32) (i32.const 0))
 (global $src/cloth/bufCi (mut i32) (i32.const 0))
 (global $src/cloth/bufCj (mut i32) (i32.const 0))
 (global $src/cloth/bufCr (mut i32) (i32.const 0))
 (global $src/cloth/bufIdx (mut i32) (i32.const 0))
 (global $src/cloth/P (mut i32) (i32.const 0))
 (global $src/cloth/Q (mut i32) (i32.const 0))
 (global $src/cloth/N (mut i32) (i32.const 0))
 (global $src/cloth/IVM (mut i32) (i32.const 0))
 (global $src/cloth/UV (mut i32) (i32.const 0))
 (global $src/cloth/CI (mut i32) (i32.const 0))
 (global $src/cloth/CJ (mut i32) (i32.const 0))
 (global $src/cloth/CR (mut i32) (i32.const 0))
 (global $src/cloth/IDX (mut i32) (i32.const 0))
 (global $src/cloth/COLS (mut i32) (i32.const 0))
 (global $src/cloth/ROWS (mut i32) (i32.const 0))
 (global $src/cloth/NV (mut i32) (i32.const 0))
 (global $src/cloth/NI (mut i32) (i32.const 0))
 (global $src/cloth/SPACING (mut f32) (f32.const 0.05000000074505806))
 (global $src/cloth/PIN_Y (mut f32) (f32.const 1))
 (global $src/cloth/nStruct (mut i32) (i32.const 0))
 (global $src/cloth/nShear (mut i32) (i32.const 0))
 (global $src/cloth/nBend (mut i32) (i32.const 0))
 (global $src/cloth/nCons (mut i32) (i32.const 0))
 (global $src/cloth/gravity (mut f32) (f32.const 9.199999809265137))
 (global $src/cloth/retention (mut f32) (f32.const 0.9819999933242798))
 (global $src/cloth/windAmp (mut f32) (f32.const 0.550000011920929))
 (global $src/cloth/windFreq (mut f32) (f32.const 2.0999999046325684))
 (global $src/cloth/iterations (mut i32) (i32.const 6))
 (global $src/cloth/kStruct (mut f32) (f32.const 1))
 (global $src/cloth/kShear (mut f32) (f32.const 0.7799999713897705))
 (global $src/cloth/kBend (mut f32) (f32.const 0.30000001192092896))
 (global $src/cloth/floorY (mut f32) (f32.const -2.4000000953674316))
 (global $src/cloth/sphX (mut f32) (f32.const 0))
 (global $src/cloth/sphY (mut f32) (f32.const 0))
 (global $src/cloth/sphZ (mut f32) (f32.const 0))
 (global $src/cloth/sphR (mut f32) (f32.const 0.6000000238418579))
 (global $src/cloth/sphOn (mut i32) (i32.const 1))
 (global $src/cloth/hitCount (mut i32) (i32.const 0))
 (global $src/cloth/floorHits (mut i32) (i32.const 0))
 (global $src/cloth/pinnedN (mut i32) (i32.const 0))
 (global $src/cloth/pinMode (mut i32) (i32.const 0))
 (global $~lib/math/rempio2_y0 (mut f64) (f64.const 0))
 (global $~lib/math/rempio2_y1 (mut f64) (f64.const 0))
 (global $~lib/math/res128_hi (mut i64) (i64.const 0))
 (memory $0 1)
 (data $0 (i32.const 1036) ",")
 (data $0.1 (i32.const 1048) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $1 (i32.const 1084) "<")
 (data $1.1 (i32.const 1096) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $2 (i32.const 1148) "<")
 (data $2.1 (i32.const 1160) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $3 (i32.const 1212) "<")
 (data $3.1 (i32.const 1224) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
 (data $4 (i32.const 1280) "n\83\f9\a2\00\00\00\00\d1W\'\fc)\15DN\99\95b\db\c0\dd4\f5\abcQ\feA\90C<:n$\b7a\c5\bb\de\ea.I\06\e0\d2MB\1c\eb\1d\fe\1c\92\d1\t\f55\82\e8>\a7)\b1&p\9c\e9\84D\bb.9\d6\919A~_\b4\8b_\84\9c\f49S\83\ff\97\f8\1f;(\f9\bd\8b\11/\ef\0f\98\05\de\cf~6m\1fm\nZf?FO\b7\t\cb\'\c7\ba\'u-\ea_\9e\f79\07={\f1\e5\eb\b1_\fbk\ea\92R\8aF0\03V\08]\8d\1f \bc\cf\f0\abk{\fca\91\e3\a9\1d6\f4\9a_\85\99e\08\1b\e6^\80\d8\ff\8d@h\a0\14W\15\06\061\'sM")
 (export "init" (func $src/cloth/init))
 (export "setPinMode" (func $src/cloth/setPinMode))
 (export "reset" (func $src/cloth/reset))
 (export "setPhysics" (func $src/cloth/setPhysics))
 (export "setSphere" (func $src/cloth/setSphere))
 (export "step" (func $src/cloth/step))
 (export "computeNormals" (func $src/cloth/computeNormals))
 (export "getVertexCount" (func $src/cloth/getVertexCount))
 (export "getIndexCount" (func $src/cloth/getIndexCount))
 (export "getCols" (func $src/cloth/getCols))
 (export "getRows" (func $src/cloth/getRows))
 (export "getStructCount" (func $src/cloth/getStructCount))
 (export "getShearCount" (func $src/cloth/getShearCount))
 (export "getBendCount" (func $src/cloth/getBendCount))
 (export "getConstraintCount" (func $src/cloth/getConstraintCount))
 (export "getPinnedCount" (func $src/cloth/getPinnedCount))
 (export "getHitCount" (func $src/cloth/getHitCount))
 (export "getFloorHits" (func $src/cloth/getFloorHits))
 (export "posPtr" (func $src/cloth/posPtr))
 (export "prevPtr" (func $src/cloth/prevPtr))
 (export "normPtr" (func $src/cloth/normPtr))
 (export "uvPtr" (func $src/cloth/uvPtr))
 (export "idxPtr" (func $src/cloth/idxPtr))
 (export "constraintError" (func $src/cloth/constraintError))
 (export "nearestToSphere" (func $src/cloth/nearestToSphere))
 (export "extentY" (func $src/cloth/extentY))
 (export "poke" (func $src/cloth/poke))
 (export "vertexX" (func $src/cloth/vertexX))
 (export "vertexY" (func $src/cloth/vertexY))
 (export "vertexZ" (func $src/cloth/vertexZ))
 (export "normalY" (func $src/cloth/normalY))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/stub/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 1168
   i32.const 1232
   i32.const 86
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 16
  i32.add
  local.tee $3
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1168
   i32.const 1232
   i32.const 33
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/stub/offset
  i32.const 4
  i32.add
  local.tee $2
  local.get $3
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.tee $3
  i32.add
  local.tee $4
  memory.size
  local.tee $5
  i32.const 16
  i32.shl
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $6
  i32.gt_u
  if
   local.get $5
   local.get $4
   local.get $6
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $6
   local.get $5
   local.get $6
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $6
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  global.get $~lib/rt/stub/offset
  local.get $4
  global.set $~lib/rt/stub/offset
  local.get $3
  i32.store
  local.get $2
  i32.const 4
  i32.sub
  local.tee $3
  i32.const 0
  i32.store offset=4
  local.get $3
  i32.const 0
  i32.store offset=8
  local.get $3
  local.get $1
  i32.store offset=12
  local.get $3
  local.get $0
  i32.store offset=16
  local.get $2
  i32.const 16
  i32.add
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 3
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $1
  i32.const 1073741820
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   i32.const 1056
   i32.const 1104
   i32.const 19
   i32.const 57
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $2
  i32.shl
  local.tee $1
  i32.const 1
  call $~lib/rt/stub/__new
  local.tee $2
  i32.const 0
  local.get $1
  memory.fill
  local.get $0
  local.get $2
  i32.store
  local.get $0
  local.get $2
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
 )
 (func $~lib/math/NativeMath.sin (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i32)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $5
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $3
  i32.const 31
  i32.shr_u
  local.set $6
  local.get $3
  i32.const 2147483647
  i32.and
  local.tee $3
  i32.const 1072243195
  i32.le_u
  if
   local.get $3
   i32.const 1045430272
   i32.lt_u
   if
    local.get $0
    return
   end
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $0
   f64.mul
   local.get $1
   local.get $1
   local.get $1
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $1
   local.get $1
   local.get $1
   f64.mul
   f64.mul
   local.get $1
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.const -0.16666666666666632
   f64.add
   f64.mul
   f64.add
   return
  end
  local.get $3
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.0 (result i32)
   local.get $5
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $4
   i32.const 1073928572
   i32.lt_u
   if
    i32.const 1
    local.set $3
    local.get $6
    if (result f64)
     local.get $0
     f64.const 1.5707963267341256
     f64.add
     local.set $0
     i32.const -1
     local.set $3
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const 6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const 6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const 6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const 2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const 2.0222662487959506e-21
      f64.add
     end
    else
     local.get $0
     f64.const -1.5707963267341256
     f64.add
     local.set $0
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const -6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const -6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const -6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const -2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const -2.0222662487959506e-21
      f64.add
     end
    end
    local.get $0
    global.set $~lib/math/rempio2_y0
    global.set $~lib/math/rempio2_y1
    local.get $3
    br $~lib/math/rempio2|inlined.0
   end
   local.get $4
   i32.const 1094263291
   i32.lt_u
   if
    local.get $4
    i32.const 20
    i32.shr_u
    local.tee $3
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $7
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $7
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $2
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $7
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $7
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $1
     f64.sub
     local.tee $0
     f64.sub
     local.get $1
     f64.sub
     f64.sub
     local.set $2
     local.get $3
     local.get $0
     local.get $2
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $7
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $7
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $1
      f64.sub
      local.tee $0
      f64.sub
      local.get $1
      f64.sub
      f64.sub
      local.set $2
      local.get $0
      local.get $2
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $2
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $7
    i32.trunc_sat_f64_s
    br $~lib/math/rempio2|inlined.0
   end
   i32.const 0
   local.get $5
   call $~lib/math/pio2_large_quot
   local.tee $3
   i32.sub
   local.get $3
   local.get $6
   select
  end
  local.set $3
  global.get $~lib/math/rempio2_y0
  local.set $2
  global.get $~lib/math/rempio2_y1
  local.set $7
  local.get $3
  i32.const 1
  i32.and
  if (result f64)
   local.get $2
   local.get $2
   f64.mul
   local.tee $0
   local.get $0
   f64.mul
   local.set $1
   f64.const 1
   local.get $0
   f64.const 0.5
   f64.mul
   local.tee $8
   f64.sub
   local.tee $9
   f64.const 1
   local.get $9
   f64.sub
   local.get $8
   f64.sub
   local.get $0
   local.get $0
   local.get $0
   local.get $0
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $1
   local.get $1
   f64.mul
   local.get $0
   local.get $0
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $2
   local.get $7
   f64.mul
   f64.sub
   f64.add
   f64.add
  else
   local.get $2
   local.get $2
   f64.mul
   local.tee $0
   local.get $2
   f64.mul
   local.set $1
   local.get $2
   local.get $0
   local.get $7
   f64.const 0.5
   f64.mul
   local.get $1
   local.get $0
   local.get $0
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   f64.mul
   local.get $0
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $7
   f64.sub
   local.get $1
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  end
  local.tee $0
  f64.neg
  local.get $0
  local.get $3
  i32.const 2
  i32.and
  select
 )
 (func $src/cloth/computeNormals
  (local $0 i32)
  (local $1 i32)
  (local $2 f32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 f32)
  (local $10 f32)
  (local $11 f32)
  (local $12 f32)
  (local $13 f32)
  (local $14 f32)
  loop $for-loop|0
   local.get $0
   global.get $src/cloth/NV
   i32.lt_s
   if
    global.get $src/cloth/N
    local.get $0
    i32.const 4
    i32.shl
    i32.add
    local.tee $4
    f32.const 0
    f32.store
    local.get $4
    f32.const 0
    f32.store offset=4
    local.get $4
    f32.const 0
    f32.store offset=8
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  loop $for-loop|1
   local.get $1
   global.get $src/cloth/NI
   i32.lt_s
   if
    global.get $src/cloth/IDX
    local.get $1
    i32.const 1
    i32.add
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.const 4
    i32.shl
    local.tee $4
    global.get $src/cloth/P
    i32.add
    local.tee $6
    f32.load
    global.get $src/cloth/IDX
    local.get $1
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.const 4
    i32.shl
    local.tee $7
    global.get $src/cloth/P
    i32.add
    local.tee $8
    f32.load
    local.tee $2
    f32.sub
    local.set $9
    local.get $6
    f32.load offset=8
    local.get $8
    f32.load offset=8
    local.tee $10
    f32.sub
    local.set $11
    global.get $src/cloth/IDX
    local.get $1
    i32.const 2
    i32.add
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.const 4
    i32.shl
    local.tee $5
    global.get $src/cloth/P
    i32.add
    local.tee $0
    f32.load
    local.get $2
    f32.sub
    local.set $12
    global.get $src/cloth/N
    local.get $7
    i32.add
    local.tee $7
    local.get $7
    f32.load
    local.get $6
    f32.load offset=4
    local.get $8
    f32.load offset=4
    local.tee $13
    f32.sub
    local.tee $14
    local.get $0
    f32.load offset=8
    local.get $10
    f32.sub
    local.tee $2
    f32.mul
    local.get $11
    local.get $0
    f32.load offset=4
    local.get $13
    f32.sub
    local.tee $10
    f32.mul
    f32.sub
    local.tee $13
    f32.add
    f32.store
    local.get $7
    i32.const 4
    i32.add
    local.get $7
    f32.load offset=4
    local.get $11
    local.get $12
    f32.mul
    local.get $9
    local.get $2
    f32.mul
    f32.sub
    local.tee $2
    f32.add
    f32.store
    local.get $7
    i32.const 8
    i32.add
    local.get $7
    f32.load offset=8
    local.get $9
    local.get $10
    f32.mul
    local.get $14
    local.get $12
    f32.mul
    f32.sub
    local.tee $9
    f32.add
    f32.store
    global.get $src/cloth/N
    local.get $4
    i32.add
    local.tee $0
    local.get $0
    f32.load
    local.get $13
    f32.add
    f32.store
    local.get $0
    i32.const 4
    i32.add
    local.get $0
    f32.load offset=4
    local.get $2
    f32.add
    f32.store
    local.get $0
    i32.const 8
    i32.add
    local.get $0
    f32.load offset=8
    local.get $9
    f32.add
    f32.store
    global.get $src/cloth/N
    local.get $5
    i32.add
    local.tee $0
    local.get $0
    f32.load
    local.get $13
    f32.add
    f32.store
    local.get $0
    i32.const 4
    i32.add
    local.get $0
    f32.load offset=4
    local.get $2
    f32.add
    f32.store
    local.get $0
    i32.const 8
    i32.add
    local.get $0
    f32.load offset=8
    local.get $9
    f32.add
    f32.store
    local.get $1
    i32.const 3
    i32.add
    local.set $1
    br $for-loop|1
   end
  end
  loop $for-loop|2
   local.get $3
   global.get $src/cloth/NV
   i32.lt_s
   if
    global.get $src/cloth/N
    local.get $3
    i32.const 4
    i32.shl
    i32.add
    local.tee $0
    f32.load
    local.tee $2
    local.get $2
    f32.mul
    local.get $0
    i32.const 4
    i32.add
    f32.load
    local.tee $9
    local.get $9
    f32.mul
    f32.add
    local.get $0
    i32.const 8
    i32.add
    f32.load
    local.tee $10
    local.get $10
    f32.mul
    f32.add
    local.tee $11
    f32.const 9.999999682655225e-21
    f32.gt
    if
     local.get $0
     local.get $2
     f32.const 1
     local.get $11
     f64.promote_f32
     f64.sqrt
     f32.demote_f64
     f32.div
     local.tee $2
     f32.mul
     f32.store
     local.get $0
     local.get $9
     local.get $2
     f32.mul
     f32.store offset=4
     local.get $0
     local.get $10
     local.get $2
     f32.mul
     f32.store offset=8
    else
     local.get $0
     f32.const 0
     f32.store
     local.get $0
     f32.const 1
     f32.store offset=4
     local.get $0
     f32.const 0
     f32.store offset=8
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|2
   end
  end
 )
 (func $~lib/math/pio2_large_quot (param $0 i64) (result i32)
  (local $1 i64)
  (local $2 i64)
  (local $3 i64)
  (local $4 i32)
  (local $5 f64)
  (local $6 i64)
  (local $7 i64)
  (local $8 i64)
  (local $9 i64)
  (local $10 i64)
  (local $11 i64)
  (local $12 i64)
  local.get $0
  i64.const 9223372036854775807
  i64.and
  i64.const 52
  i64.shr_u
  i64.const 1045
  i64.sub
  local.tee $1
  i64.const 63
  i64.and
  local.set $6
  local.get $1
  i64.const 6
  i64.shr_s
  i32.wrap_i64
  i32.const 3
  i32.shl
  i32.const 1280
  i32.add
  local.tee $4
  i64.load
  local.set $3
  local.get $4
  i64.load offset=8
  local.set $2
  local.get $4
  i64.load offset=16
  local.set $1
  local.get $6
  i64.const 0
  i64.ne
  if
   local.get $3
   local.get $6
   i64.shl
   local.get $2
   i64.const 64
   local.get $6
   i64.sub
   local.tee $7
   i64.shr_u
   i64.or
   local.set $3
   local.get $2
   local.get $6
   i64.shl
   local.get $1
   local.get $7
   i64.shr_u
   i64.or
   local.set $2
   local.get $1
   local.get $6
   i64.shl
   local.get $4
   i64.load offset=24
   local.get $7
   i64.shr_u
   i64.or
   local.set $1
  end
  local.get $0
  i64.const 4503599627370495
  i64.and
  i64.const 4503599627370496
  i64.or
  local.tee $6
  i64.const 4294967295
  i64.and
  local.set $7
  local.get $2
  i64.const 4294967295
  i64.and
  local.tee $8
  local.get $6
  i64.const 32
  i64.shr_u
  local.tee $9
  i64.mul
  local.get $2
  i64.const 32
  i64.shr_u
  local.tee $2
  local.get $7
  i64.mul
  local.get $7
  local.get $8
  i64.mul
  local.tee $7
  i64.const 32
  i64.shr_u
  i64.add
  local.tee $8
  i64.const 4294967295
  i64.and
  i64.add
  local.set $10
  local.get $2
  local.get $9
  i64.mul
  local.get $8
  i64.const 32
  i64.shr_u
  i64.add
  local.get $10
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  local.get $9
  local.get $1
  i64.const 32
  i64.shr_u
  i64.mul
  local.tee $1
  local.get $7
  i64.const 4294967295
  i64.and
  local.get $10
  i64.const 32
  i64.shl
  i64.add
  i64.add
  local.tee $2
  local.get $1
  i64.lt_u
  i64.extend_i32_u
  global.get $~lib/math/res128_hi
  local.get $3
  local.get $6
  i64.mul
  i64.add
  i64.add
  local.tee $3
  i64.const 2
  i64.shl
  local.get $2
  i64.const 62
  i64.shr_u
  i64.or
  local.tee $6
  i64.const 63
  i64.shr_s
  local.tee $7
  local.get $2
  i64.const 2
  i64.shl
  i64.xor
  local.set $2
  local.get $6
  local.get $7
  i64.const 1
  i64.shr_s
  i64.xor
  local.tee $1
  i64.clz
  local.set $8
  local.get $1
  local.get $8
  i64.shl
  local.get $2
  i64.const 64
  local.get $8
  i64.sub
  i64.shr_u
  i64.or
  local.tee $9
  i64.const 4294967295
  i64.and
  local.set $1
  local.get $9
  i64.const 32
  i64.shr_u
  local.tee $10
  i64.const 560513588
  i64.mul
  local.get $1
  i64.const 3373259426
  i64.mul
  local.get $1
  i64.const 560513588
  i64.mul
  local.tee $11
  i64.const 32
  i64.shr_u
  i64.add
  local.tee $12
  i64.const 4294967295
  i64.and
  i64.add
  local.set $1
  local.get $10
  i64.const 3373259426
  i64.mul
  local.get $12
  i64.const 32
  i64.shr_u
  i64.add
  local.get $1
  i64.const 32
  i64.shr_u
  i64.add
  global.set $~lib/math/res128_hi
  local.get $9
  f64.convert_i64_u
  f64.const 3.753184150245214e-04
  f64.mul
  local.get $2
  local.get $8
  i64.shl
  f64.convert_i64_u
  f64.const 3.834951969714103e-04
  f64.mul
  f64.add
  i64.trunc_sat_f64_u
  local.tee $2
  local.get $11
  i64.const 4294967295
  i64.and
  local.get $1
  i64.const 32
  i64.shl
  i64.add
  local.tee $1
  i64.gt_u
  i64.extend_i32_u
  global.get $~lib/math/res128_hi
  local.tee $9
  i64.const 11
  i64.shr_u
  i64.add
  f64.convert_i64_u
  global.set $~lib/math/rempio2_y0
  local.get $9
  i64.const 53
  i64.shl
  local.get $1
  i64.const 11
  i64.shr_u
  i64.or
  local.get $2
  i64.add
  f64.convert_i64_u
  f64.const 5.421010862427522e-20
  f64.mul
  global.set $~lib/math/rempio2_y1
  global.get $~lib/math/rempio2_y0
  i64.const 4372995238176751616
  local.get $8
  i64.const 52
  i64.shl
  i64.sub
  local.get $0
  local.get $6
  i64.xor
  i64.const -9223372036854775808
  i64.and
  i64.or
  f64.reinterpret_i64
  local.tee $5
  f64.mul
  global.set $~lib/math/rempio2_y0
  global.get $~lib/math/rempio2_y1
  local.get $5
  f64.mul
  global.set $~lib/math/rempio2_y1
  local.get $3
  i64.const 62
  i64.shr_s
  local.get $7
  i64.sub
  i32.wrap_i64
 )
 (func $src/cloth/setPinMode (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  global.set $src/cloth/pinMode
  i32.const 0
  global.set $src/cloth/pinnedN
  loop $for-loop|0
   local.get $1
   global.get $src/cloth/ROWS
   i32.lt_s
   if
    i32.const 0
    local.set $0
    loop $for-loop|1
     local.get $0
     global.get $src/cloth/COLS
     i32.lt_s
     if
      global.get $src/cloth/IVM
      local.get $1
      global.get $src/cloth/COLS
      i32.mul
      local.get $0
      i32.add
      i32.const 2
      i32.shl
      i32.add
      f32.const 0
      f32.const 1
      global.get $src/cloth/pinMode
      i32.const 1
      i32.eq
      if (result i32)
       local.get $0
       i32.eqz
       local.get $1
       i32.eqz
       i32.or
       local.get $1
       global.get $src/cloth/ROWS
       i32.const 1
       i32.sub
       i32.eq
       i32.or
       local.get $0
       global.get $src/cloth/COLS
       i32.const 1
       i32.sub
       i32.eq
       i32.or
      else
       local.get $1
       i32.const 2
       i32.lt_s
       local.tee $2
       local.get $1
       global.get $src/cloth/ROWS
       i32.const 2
       i32.sub
       i32.ge_s
       local.get $2
       select
       i32.const 0
       local.get $0
       i32.const 2
       i32.lt_s
       local.tee $2
       local.get $0
       global.get $src/cloth/COLS
       i32.const 2
       i32.sub
       i32.ge_s
       local.get $2
       select
       select
      end
      local.tee $2
      select
      f32.store
      local.get $2
      if
       global.get $src/cloth/pinnedN
       i32.const 1
       i32.add
       global.set $src/cloth/pinnedN
      end
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|1
     end
    end
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  call $src/cloth/reset
 )
 (func $src/cloth/reset
  (local $0 i32)
  (local $1 i32)
  (local $2 f32)
  (local $3 f32)
  (local $4 f32)
  (local $5 f32)
  (local $6 i32)
  (local $7 i32)
  global.get $src/cloth/COLS
  i32.const 1
  i32.sub
  f32.convert_i32_s
  f32.const 0.5
  f32.mul
  local.set $2
  global.get $src/cloth/ROWS
  i32.const 1
  i32.sub
  f32.convert_i32_s
  f32.const 0.5
  f32.mul
  local.set $3
  loop $for-loop|0
   local.get $1
   global.get $src/cloth/ROWS
   i32.lt_s
   if
    i32.const 0
    local.set $0
    loop $for-loop|1
     local.get $0
     global.get $src/cloth/COLS
     i32.lt_s
     if
      local.get $1
      global.get $src/cloth/COLS
      i32.mul
      local.get $0
      i32.add
      i32.const 4
      i32.shl
      local.tee $6
      global.get $src/cloth/P
      i32.add
      local.tee $7
      local.get $0
      f32.convert_i32_s
      local.get $2
      f32.sub
      global.get $src/cloth/SPACING
      f32.mul
      local.tee $4
      f32.store
      local.get $7
      global.get $src/cloth/PIN_Y
      f32.store offset=4
      local.get $7
      local.get $1
      f32.convert_i32_s
      local.get $3
      f32.sub
      global.get $src/cloth/SPACING
      f32.mul
      local.tee $5
      f32.store offset=8
      global.get $src/cloth/Q
      local.get $6
      i32.add
      local.tee $7
      local.get $4
      f32.store
      local.get $7
      global.get $src/cloth/PIN_Y
      f32.store offset=4
      local.get $7
      local.get $5
      f32.store offset=8
      global.get $src/cloth/N
      local.get $6
      i32.add
      local.tee $6
      f32.const 0
      f32.store
      local.get $6
      f32.const 1
      f32.store offset=4
      local.get $6
      f32.const 0
      f32.store offset=8
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|1
     end
    end
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  i32.const 0
  global.set $src/cloth/hitCount
  i32.const 0
  global.set $src/cloth/floorHits
  call $src/cloth/computeNormals
 )
 (func $~start
  i32.const 1484
  global.set $~lib/rt/stub/offset
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 36864
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufP
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 36864
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufQ
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 36864
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufN
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 9216
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufIvm
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 18432
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufUv
  i32.const 12
  i32.const 5
  call $~lib/rt/stub/__new
  i32.const 56000
  i32.const 1
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufCi
  i32.const 12
  i32.const 5
  call $~lib/rt/stub/__new
  i32.const 56000
  i32.const 1
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufCj
  i32.const 12
  i32.const 4
  call $~lib/rt/stub/__new
  i32.const 56000
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufCr
  i32.const 12
  i32.const 5
  call $~lib/rt/stub/__new
  i32.const 60000
  i32.const 1
  call $~lib/arraybuffer/ArrayBufferView#constructor
  global.set $src/cloth/bufIdx
 )
 (func $~lib/math/NativeMath.cos (param $0 f64) (result f64)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 i32)
  (local $5 i64)
  (local $6 i32)
  (local $7 f64)
  (local $8 f64)
  (local $9 f64)
  local.get $0
  i64.reinterpret_f64
  local.tee $5
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  local.tee $3
  i32.const 31
  i32.shr_u
  local.set $6
  local.get $3
  i32.const 2147483647
  i32.and
  local.tee $3
  i32.const 1072243195
  i32.le_u
  if
   local.get $3
   i32.const 1044816030
   i32.lt_u
   if
    f64.const 1
    return
   end
   local.get $0
   local.get $0
   f64.mul
   local.tee $1
   local.get $1
   f64.mul
   local.set $2
   f64.const 1
   local.get $1
   f64.const 0.5
   f64.mul
   local.tee $7
   f64.sub
   local.tee $8
   f64.const 1
   local.get $8
   f64.sub
   local.get $7
   f64.sub
   local.get $1
   local.get $1
   local.get $1
   local.get $1
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $2
   local.get $2
   f64.mul
   local.get $1
   local.get $1
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $0
   f64.const 0
   f64.mul
   f64.sub
   f64.add
   f64.add
   return
  end
  local.get $3
  i32.const 2146435072
  i32.ge_u
  if
   local.get $0
   local.get $0
   f64.sub
   return
  end
  block $~lib/math/rempio2|inlined.1 (result i32)
   local.get $5
   i64.const 32
   i64.shr_u
   i32.wrap_i64
   i32.const 2147483647
   i32.and
   local.tee $4
   i32.const 1073928572
   i32.lt_u
   if
    i32.const 1
    local.set $3
    local.get $6
    if (result f64)
     local.get $0
     f64.const 1.5707963267341256
     f64.add
     local.set $0
     i32.const -1
     local.set $3
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const 6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const 6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const 6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const 2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const 2.0222662487959506e-21
      f64.add
     end
    else
     local.get $0
     f64.const -1.5707963267341256
     f64.add
     local.set $0
     local.get $4
     i32.const 1073291771
     i32.ne
     if (result f64)
      local.get $0
      local.get $0
      f64.const -6.077100506506192e-11
      f64.add
      local.tee $0
      f64.sub
      f64.const -6.077100506506192e-11
      f64.add
     else
      local.get $0
      f64.const -6.077100506303966e-11
      f64.add
      local.tee $1
      f64.const -2.0222662487959506e-21
      f64.add
      local.set $0
      local.get $1
      local.get $0
      f64.sub
      f64.const -2.0222662487959506e-21
      f64.add
     end
    end
    local.get $0
    global.set $~lib/math/rempio2_y0
    global.set $~lib/math/rempio2_y1
    local.get $3
    br $~lib/math/rempio2|inlined.1
   end
   local.get $4
   i32.const 1094263291
   i32.lt_u
   if
    local.get $4
    i32.const 20
    i32.shr_u
    local.tee $3
    local.get $0
    local.get $0
    f64.const 0.6366197723675814
    f64.mul
    f64.nearest
    local.tee $7
    f64.const 1.5707963267341256
    f64.mul
    f64.sub
    local.tee $0
    local.get $7
    f64.const 6.077100506506192e-11
    f64.mul
    local.tee $2
    f64.sub
    local.tee $1
    i64.reinterpret_f64
    i64.const 32
    i64.shr_u
    i32.wrap_i64
    i32.const 20
    i32.shr_u
    i32.const 2047
    i32.and
    i32.sub
    i32.const 16
    i32.gt_u
    if
     local.get $7
     f64.const 2.0222662487959506e-21
     f64.mul
     local.get $0
     local.get $0
     local.get $7
     f64.const 6.077100506303966e-11
     f64.mul
     local.tee $1
     f64.sub
     local.tee $0
     f64.sub
     local.get $1
     f64.sub
     f64.sub
     local.set $2
     local.get $3
     local.get $0
     local.get $2
     f64.sub
     local.tee $1
     i64.reinterpret_f64
     i64.const 32
     i64.shr_u
     i32.wrap_i64
     i32.const 20
     i32.shr_u
     i32.const 2047
     i32.and
     i32.sub
     i32.const 49
     i32.gt_u
     if
      local.get $7
      f64.const 8.4784276603689e-32
      f64.mul
      local.get $0
      local.get $0
      local.get $7
      f64.const 2.0222662487111665e-21
      f64.mul
      local.tee $1
      f64.sub
      local.tee $0
      f64.sub
      local.get $1
      f64.sub
      f64.sub
      local.set $2
      local.get $0
      local.get $2
      f64.sub
      local.set $1
     end
    end
    local.get $1
    global.set $~lib/math/rempio2_y0
    local.get $0
    local.get $1
    f64.sub
    local.get $2
    f64.sub
    global.set $~lib/math/rempio2_y1
    local.get $7
    i32.trunc_sat_f64_s
    br $~lib/math/rempio2|inlined.1
   end
   i32.const 0
   local.get $5
   call $~lib/math/pio2_large_quot
   local.tee $3
   i32.sub
   local.get $3
   local.get $6
   select
  end
  local.set $3
  global.get $~lib/math/rempio2_y0
  local.set $1
  global.get $~lib/math/rempio2_y1
  local.set $2
  local.get $3
  i32.const 1
  i32.and
  if (result f64)
   local.get $1
   local.get $1
   f64.mul
   local.tee $0
   local.get $1
   f64.mul
   local.set $7
   local.get $1
   local.get $0
   local.get $2
   f64.const 0.5
   f64.mul
   local.get $7
   local.get $0
   local.get $0
   f64.const 2.7557313707070068e-06
   f64.mul
   f64.const -1.984126982985795e-04
   f64.add
   f64.mul
   f64.const 0.00833333333332249
   f64.add
   local.get $0
   local.get $0
   local.get $0
   f64.mul
   f64.mul
   local.get $0
   f64.const 1.58969099521155e-10
   f64.mul
   f64.const -2.5050760253406863e-08
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.sub
   f64.mul
   local.get $2
   f64.sub
   local.get $7
   f64.const -0.16666666666666632
   f64.mul
   f64.sub
   f64.sub
  else
   local.get $1
   local.get $1
   f64.mul
   local.tee $7
   local.get $7
   f64.mul
   local.set $8
   f64.const 1
   local.get $7
   f64.const 0.5
   f64.mul
   local.tee $0
   f64.sub
   local.tee $9
   f64.const 1
   local.get $9
   f64.sub
   local.get $0
   f64.sub
   local.get $7
   local.get $7
   local.get $7
   local.get $7
   f64.const 2.480158728947673e-05
   f64.mul
   f64.const -0.001388888888887411
   f64.add
   f64.mul
   f64.const 0.0416666666666666
   f64.add
   f64.mul
   local.get $8
   local.get $8
   f64.mul
   local.get $7
   local.get $7
   f64.const -1.1359647557788195e-11
   f64.mul
   f64.const 2.087572321298175e-09
   f64.add
   f64.mul
   f64.const -2.7557314351390663e-07
   f64.add
   f64.mul
   f64.add
   f64.mul
   local.get $1
   local.get $2
   f64.mul
   f64.sub
   f64.add
   f64.add
  end
  local.tee $0
  f64.neg
  local.get $0
  local.get $3
  i32.const 1
  i32.add
  i32.const 2
  i32.and
  select
 )
 (func $src/cloth/vertexZ (param $0 i32) (result f32)
  global.get $src/cloth/P
  local.get $0
  i32.const 4
  i32.shl
  i32.add
  f32.load offset=8
 )
 (func $src/cloth/vertexY (param $0 i32) (result f32)
  global.get $src/cloth/P
  local.get $0
  i32.const 4
  i32.shl
  i32.add
  f32.load offset=4
 )
 (func $src/cloth/vertexX (param $0 i32) (result f32)
  global.get $src/cloth/P
  local.get $0
  i32.const 4
  i32.shl
  i32.add
  f32.load
 )
 (func $src/cloth/uvPtr (result i32)
  global.get $src/cloth/UV
 )
 (func $src/cloth/step (param $0 f32) (param $1 f32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 f32)
  (local $6 f32)
  (local $7 i32)
  (local $8 f32)
  (local $9 f32)
  (local $10 f32)
  (local $11 f32)
  (local $12 f32)
  (local $13 f32)
  (local $14 f32)
  (local $15 f32)
  (local $16 f32)
  (local $17 f32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  local.get $0
  local.get $0
  f32.mul
  local.set $12
  global.get $src/cloth/windAmp
  local.get $1
  f32.const 0.6100000143051147
  f32.mul
  f64.promote_f32
  call $~lib/math/NativeMath.sin
  f32.demote_f64
  f32.const 0.5
  f32.mul
  f32.const 0.5
  f32.add
  f32.mul
  local.set $13
  global.get $src/cloth/windFreq
  local.set $14
  loop $for-loop|0
   local.get $2
   global.get $src/cloth/NV
   i32.lt_s
   if
    global.get $src/cloth/IVM
    local.get $2
    i32.const 2
    i32.shl
    i32.add
    f32.load
    f32.const 0
    f32.ne
    if
     local.get $2
     i32.const 4
     i32.shl
     local.tee $3
     global.get $src/cloth/Q
     i32.add
     local.set $4
     global.get $src/cloth/P
     local.get $3
     i32.add
     local.tee $3
     f32.load
     local.set $15
     local.get $3
     f32.load offset=4
     local.set $8
     local.get $13
     local.get $1
     local.get $14
     f32.mul
     local.get $15
     f32.const 1.899999976158142
     f32.mul
     f32.sub
     local.get $3
     f32.load offset=8
     local.tee $9
     f32.const 1.350000023841858
     f32.mul
     f32.sub
     local.tee $0
     f64.promote_f32
     call $~lib/math/NativeMath.sin
     f32.demote_f64
     f32.mul
     local.set $5
     local.get $13
     f32.const 0.41999998688697815
     f32.mul
     local.get $0
     f32.const 0.8299999833106995
     f32.mul
     local.get $8
     f32.const 1.7000000476837158
     f32.mul
     f32.add
     f64.promote_f32
     call $~lib/math/NativeMath.cos
     f32.demote_f64
     f32.mul
     local.set $6
     local.get $13
     f32.const 0.6000000238418579
     f32.mul
     local.get $0
     f32.const 1.3700000047683716
     f32.mul
     local.get $9
     f32.const 2.0999999046325684
     f32.mul
     f32.add
     f64.promote_f32
     call $~lib/math/NativeMath.sin
     f32.demote_f64
     f32.mul
     global.get $src/cloth/gravity
     f32.sub
     local.set $0
     local.get $15
     local.get $15
     local.get $4
     f32.load
     f32.sub
     global.get $src/cloth/retention
     f32.mul
     f32.add
     local.get $5
     local.get $12
     f32.mul
     f32.add
     local.tee $5
     local.get $15
     f32.sub
     local.tee $10
     local.get $10
     f32.mul
     local.get $8
     local.get $8
     local.get $4
     f32.load offset=4
     f32.sub
     global.get $src/cloth/retention
     f32.mul
     f32.add
     local.get $0
     local.get $12
     f32.mul
     f32.add
     local.tee $0
     local.get $8
     f32.sub
     local.tee $11
     local.get $11
     f32.mul
     f32.add
     local.get $9
     local.get $9
     local.get $4
     f32.load offset=8
     f32.sub
     global.get $src/cloth/retention
     f32.mul
     f32.add
     local.get $6
     local.get $12
     f32.mul
     f32.add
     local.tee $6
     local.get $9
     f32.sub
     local.tee $16
     local.get $16
     f32.mul
     f32.add
     local.tee $17
     f32.const 0.014399999752640724
     f32.gt
     if
      local.get $15
      local.get $10
      f32.const 0.11999999731779099
      local.get $17
      f64.promote_f32
      f64.sqrt
      f32.demote_f64
      f32.div
      local.tee $0
      f32.mul
      f32.add
      local.set $5
      local.get $9
      local.get $16
      local.get $0
      f32.mul
      f32.add
      local.set $6
      local.get $8
      local.get $11
      local.get $0
      f32.mul
      f32.add
      local.set $0
     end
     local.get $4
     local.get $15
     f32.store
     local.get $4
     local.get $8
     f32.store offset=4
     local.get $4
     local.get $9
     f32.store offset=8
     local.get $3
     local.get $5
     f32.store
     local.get $3
     local.get $0
     f32.store offset=4
     local.get $3
     local.get $6
     f32.store offset=8
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  i32.const 0
  global.set $src/cloth/hitCount
  i32.const 0
  global.set $src/cloth/floorHits
  global.get $src/cloth/nStruct
  local.set $3
  global.get $src/cloth/nStruct
  global.get $src/cloth/nShear
  i32.add
  local.set $4
  loop $for-loop|1
   local.get $7
   global.get $src/cloth/iterations
   i32.lt_s
   if
    global.get $src/cloth/kStruct
    local.set $5
    i32.const 0
    local.set $2
    loop $for-loop|2
     local.get $2
     local.get $3
     i32.lt_s
     if
      block $for-continue|2
       global.get $src/cloth/IVM
       local.get $2
       i32.const 1
       i32.shl
       local.tee $18
       global.get $src/cloth/CI
       i32.add
       i32.load16_u
       local.tee $19
       i32.const 2
       i32.shl
       i32.add
       f32.load
       local.tee $1
       global.get $src/cloth/IVM
       global.get $src/cloth/CJ
       local.get $18
       i32.add
       i32.load16_u
       local.tee $18
       i32.const 2
       i32.shl
       i32.add
       f32.load
       local.tee $6
       f32.add
       f32.const 0
       f32.eq
       br_if $for-continue|2
       global.get $src/cloth/P
       local.get $18
       i32.const 4
       i32.shl
       i32.add
       local.tee $18
       f32.load
       global.get $src/cloth/P
       local.get $19
       i32.const 4
       i32.shl
       i32.add
       local.tee $19
       f32.load
       local.tee $8
       f32.sub
       local.tee $9
       local.get $9
       f32.mul
       local.get $18
       f32.load offset=4
       local.get $19
       f32.load offset=4
       local.tee $10
       f32.sub
       local.tee $11
       local.get $11
       f32.mul
       f32.add
       local.get $18
       f32.load offset=8
       local.get $19
       f32.load offset=8
       local.tee $12
       f32.sub
       local.tee $13
       local.get $13
       f32.mul
       f32.add
       local.tee $0
       f32.const 9.999999960041972e-13
       f32.lt
       br_if $for-continue|2
       local.get $0
       f64.promote_f32
       f64.sqrt
       f32.demote_f64
       local.tee $0
       global.get $src/cloth/CR
       local.get $2
       i32.const 2
       i32.shl
       i32.add
       f32.load
       f32.sub
       local.get $0
       f32.div
       local.get $5
       f32.mul
       local.set $0
       local.get $1
       local.get $6
       f32.eq
       if
        local.get $0
        f32.const 0.5
        f32.mul
        local.tee $1
        local.set $0
       else
        local.get $1
        f32.const 0
        f32.eq
        if
         f32.const 0
         local.set $1
        else
         local.get $0
         local.set $1
         f32.const 0
         local.set $0
        end
       end
       local.get $19
       local.get $8
       local.get $9
       local.get $1
       f32.mul
       f32.add
       f32.store
       local.get $19
       local.get $10
       local.get $11
       local.get $1
       f32.mul
       f32.add
       f32.store offset=4
       local.get $19
       local.get $12
       local.get $13
       local.get $1
       f32.mul
       f32.add
       f32.store offset=8
       local.get $18
       local.get $18
       f32.load
       local.get $9
       local.get $0
       f32.mul
       f32.sub
       f32.store
       local.get $18
       local.get $18
       f32.load offset=4
       local.get $11
       local.get $0
       f32.mul
       f32.sub
       f32.store offset=4
       local.get $18
       local.get $18
       f32.load offset=8
       local.get $13
       local.get $0
       f32.mul
       f32.sub
       f32.store offset=8
      end
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|2
     end
    end
    global.get $src/cloth/kShear
    local.set $5
    local.get $3
    local.set $2
    loop $for-loop|3
     local.get $2
     local.get $4
     i32.lt_s
     if
      block $for-continue|3
       global.get $src/cloth/IVM
       local.get $2
       i32.const 1
       i32.shl
       local.tee $18
       global.get $src/cloth/CI
       i32.add
       i32.load16_u
       local.tee $19
       i32.const 2
       i32.shl
       i32.add
       f32.load
       local.tee $1
       global.get $src/cloth/IVM
       global.get $src/cloth/CJ
       local.get $18
       i32.add
       i32.load16_u
       local.tee $18
       i32.const 2
       i32.shl
       i32.add
       f32.load
       local.tee $6
       f32.add
       f32.const 0
       f32.eq
       br_if $for-continue|3
       global.get $src/cloth/P
       local.get $18
       i32.const 4
       i32.shl
       i32.add
       local.tee $18
       f32.load
       global.get $src/cloth/P
       local.get $19
       i32.const 4
       i32.shl
       i32.add
       local.tee $19
       f32.load
       local.tee $8
       f32.sub
       local.tee $9
       local.get $9
       f32.mul
       local.get $18
       f32.load offset=4
       local.get $19
       f32.load offset=4
       local.tee $10
       f32.sub
       local.tee $11
       local.get $11
       f32.mul
       f32.add
       local.get $18
       f32.load offset=8
       local.get $19
       f32.load offset=8
       local.tee $12
       f32.sub
       local.tee $13
       local.get $13
       f32.mul
       f32.add
       local.tee $0
       f32.const 9.999999960041972e-13
       f32.lt
       br_if $for-continue|3
       local.get $0
       f64.promote_f32
       f64.sqrt
       f32.demote_f64
       local.tee $0
       global.get $src/cloth/CR
       local.get $2
       i32.const 2
       i32.shl
       i32.add
       f32.load
       f32.sub
       local.get $0
       f32.div
       local.get $5
       f32.mul
       local.set $0
       local.get $1
       local.get $6
       f32.eq
       if
        local.get $0
        f32.const 0.5
        f32.mul
        local.tee $1
        local.set $0
       else
        local.get $1
        f32.const 0
        f32.eq
        if
         f32.const 0
         local.set $1
        else
         local.get $0
         local.set $1
         f32.const 0
         local.set $0
        end
       end
       local.get $19
       local.get $8
       local.get $9
       local.get $1
       f32.mul
       f32.add
       f32.store
       local.get $19
       local.get $10
       local.get $11
       local.get $1
       f32.mul
       f32.add
       f32.store offset=4
       local.get $19
       local.get $12
       local.get $13
       local.get $1
       f32.mul
       f32.add
       f32.store offset=8
       local.get $18
       local.get $18
       f32.load
       local.get $9
       local.get $0
       f32.mul
       f32.sub
       f32.store
       local.get $18
       local.get $18
       f32.load offset=4
       local.get $11
       local.get $0
       f32.mul
       f32.sub
       f32.store offset=4
       local.get $18
       local.get $18
       f32.load offset=8
       local.get $13
       local.get $0
       f32.mul
       f32.sub
       f32.store offset=8
      end
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|3
     end
    end
    global.get $src/cloth/nCons
    local.set $18
    global.get $src/cloth/kBend
    local.set $5
    local.get $4
    local.set $2
    loop $for-loop|4
     local.get $2
     local.get $18
     i32.lt_s
     if
      block $for-continue|4
       global.get $src/cloth/IVM
       local.get $2
       i32.const 1
       i32.shl
       local.tee $19
       global.get $src/cloth/CI
       i32.add
       i32.load16_u
       local.tee $20
       i32.const 2
       i32.shl
       i32.add
       f32.load
       local.tee $1
       global.get $src/cloth/IVM
       global.get $src/cloth/CJ
       local.get $19
       i32.add
       i32.load16_u
       local.tee $19
       i32.const 2
       i32.shl
       i32.add
       f32.load
       local.tee $6
       f32.add
       f32.const 0
       f32.eq
       br_if $for-continue|4
       global.get $src/cloth/P
       local.get $19
       i32.const 4
       i32.shl
       i32.add
       local.tee $19
       f32.load
       global.get $src/cloth/P
       local.get $20
       i32.const 4
       i32.shl
       i32.add
       local.tee $20
       f32.load
       local.tee $8
       f32.sub
       local.tee $9
       local.get $9
       f32.mul
       local.get $19
       f32.load offset=4
       local.get $20
       f32.load offset=4
       local.tee $10
       f32.sub
       local.tee $11
       local.get $11
       f32.mul
       f32.add
       local.get $19
       f32.load offset=8
       local.get $20
       f32.load offset=8
       local.tee $12
       f32.sub
       local.tee $13
       local.get $13
       f32.mul
       f32.add
       local.tee $0
       f32.const 9.999999960041972e-13
       f32.lt
       br_if $for-continue|4
       local.get $0
       f64.promote_f32
       f64.sqrt
       f32.demote_f64
       local.tee $0
       global.get $src/cloth/CR
       local.get $2
       i32.const 2
       i32.shl
       i32.add
       f32.load
       f32.sub
       local.get $0
       f32.div
       local.get $5
       f32.mul
       local.set $0
       local.get $1
       local.get $6
       f32.eq
       if
        local.get $0
        f32.const 0.5
        f32.mul
        local.tee $1
        local.set $0
       else
        local.get $1
        f32.const 0
        f32.eq
        if
         f32.const 0
         local.set $1
        else
         local.get $0
         local.set $1
         f32.const 0
         local.set $0
        end
       end
       local.get $20
       local.get $8
       local.get $9
       local.get $1
       f32.mul
       f32.add
       f32.store
       local.get $20
       local.get $10
       local.get $11
       local.get $1
       f32.mul
       f32.add
       f32.store offset=4
       local.get $20
       local.get $12
       local.get $13
       local.get $1
       f32.mul
       f32.add
       f32.store offset=8
       local.get $19
       local.get $19
       f32.load
       local.get $9
       local.get $0
       f32.mul
       f32.sub
       f32.store
       local.get $19
       local.get $19
       f32.load offset=4
       local.get $11
       local.get $0
       f32.mul
       f32.sub
       f32.store offset=4
       local.get $19
       local.get $19
       f32.load offset=8
       local.get $13
       local.get $0
       f32.mul
       f32.sub
       f32.store offset=8
      end
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|4
     end
    end
    local.get $7
    global.get $src/cloth/iterations
    i32.const 1
    i32.sub
    i32.eq
    local.set $18
    global.get $src/cloth/sphOn
    if
     global.get $src/cloth/sphX
     local.set $0
     global.get $src/cloth/sphY
     local.set $1
     global.get $src/cloth/sphZ
     local.set $5
     global.get $src/cloth/sphR
     local.tee $6
     local.get $6
     f32.mul
     local.set $8
     i32.const 0
     local.set $2
     loop $for-loop|00
      local.get $2
      global.get $src/cloth/NV
      i32.lt_s
      if
       block $for-continue|01
        global.get $src/cloth/IVM
        local.get $2
        i32.const 2
        i32.shl
        i32.add
        f32.load
        f32.const 0
        f32.eq
        br_if $for-continue|01
        local.get $8
        global.get $src/cloth/P
        local.get $2
        i32.const 4
        i32.shl
        i32.add
        local.tee $19
        f32.load
        local.get $0
        f32.sub
        local.tee $9
        local.get $9
        f32.mul
        local.get $19
        f32.load offset=4
        local.get $1
        f32.sub
        local.tee $10
        local.get $10
        f32.mul
        f32.add
        local.get $19
        f32.load offset=8
        local.get $5
        f32.sub
        local.tee $11
        local.get $11
        f32.mul
        f32.add
        local.tee $12
        f32.le
        br_if $for-continue|01
        local.get $12
        f64.promote_f32
        f64.sqrt
        f32.demote_f64
        local.tee $12
        f32.const 9.999999974752427e-07
        f32.lt
        if
         local.get $19
         local.get $1
         local.get $6
         f32.add
         f32.store offset=4
        else
         local.get $19
         local.get $0
         local.get $9
         local.get $6
         local.get $12
         f32.div
         local.tee $9
         f32.mul
         f32.add
         f32.store
         local.get $19
         local.get $1
         local.get $10
         local.get $9
         f32.mul
         f32.add
         f32.store offset=4
         local.get $19
         local.get $5
         local.get $11
         local.get $9
         f32.mul
         f32.add
         f32.store offset=8
        end
        local.get $18
        if
         global.get $src/cloth/hitCount
         i32.const 1
         i32.add
         global.set $src/cloth/hitCount
        end
       end
       local.get $2
       i32.const 1
       i32.add
       local.set $2
       br $for-loop|00
      end
     end
    end
    i32.const 0
    local.set $2
    loop $for-loop|02
     local.get $2
     global.get $src/cloth/NV
     i32.lt_s
     if
      global.get $src/cloth/IVM
      local.get $2
      i32.const 2
      i32.shl
      i32.add
      f32.load
      f32.const 0
      f32.ne
      if
       global.get $src/cloth/floorY
       local.get $2
       i32.const 4
       i32.shl
       local.tee $19
       global.get $src/cloth/P
       i32.add
       local.tee $20
       f32.load offset=4
       f32.gt
       if
        local.get $20
        f32.load
        local.set $0
        local.get $20
        f32.load offset=8
        local.set $1
        local.get $20
        global.get $src/cloth/floorY
        f32.store offset=4
        local.get $20
        local.get $0
        global.get $src/cloth/Q
        local.get $19
        i32.add
        local.tee $19
        f32.load
        local.get $0
        f32.sub
        f32.const 0.4000000059604645
        f32.mul
        f32.add
        f32.store
        local.get $20
        local.get $1
        local.get $19
        f32.load offset=8
        local.get $1
        f32.sub
        f32.const 0.4000000059604645
        f32.mul
        f32.add
        f32.store offset=8
        local.get $18
        if
         global.get $src/cloth/floorHits
         i32.const 1
         i32.add
         global.set $src/cloth/floorHits
        end
       end
      end
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|02
     end
    end
    local.get $7
    i32.const 1
    i32.add
    local.set $7
    br $for-loop|1
   end
  end
  call $src/cloth/computeNormals
 )
 (func $src/cloth/setSphere (param $0 f32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 i32)
  local.get $0
  global.set $src/cloth/sphX
  local.get $1
  global.set $src/cloth/sphY
  local.get $2
  global.set $src/cloth/sphZ
  f32.const 0.019999999552965164
  local.get $3
  local.get $3
  f32.const 0.019999999552965164
  f32.lt
  select
  global.set $src/cloth/sphR
  local.get $4
  global.set $src/cloth/sphOn
 )
 (func $src/cloth/setPhysics (param $0 f32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 i32) (param $5 f32) (param $6 f32) (param $7 f32) (param $8 f32)
  local.get $0
  global.set $src/cloth/gravity
  f32.const 0
  f32.const 1
  local.get $1
  local.get $1
  f32.const 1
  f32.gt
  select
  local.get $1
  f32.const 0
  f32.lt
  select
  global.set $src/cloth/retention
  local.get $2
  global.set $src/cloth/windAmp
  local.get $3
  global.set $src/cloth/windFreq
  i32.const 1
  i32.const 24
  local.get $4
  local.get $4
  i32.const 24
  i32.gt_s
  select
  local.get $4
  i32.const 0
  i32.le_s
  select
  global.set $src/cloth/iterations
  f32.const 0
  f32.const 1
  local.get $5
  local.get $5
  f32.const 1
  f32.gt
  select
  local.get $5
  f32.const 0
  f32.lt
  select
  global.set $src/cloth/kStruct
  f32.const 0
  f32.const 1
  local.get $6
  local.get $6
  f32.const 1
  f32.gt
  select
  local.get $6
  f32.const 0
  f32.lt
  select
  global.set $src/cloth/kShear
  f32.const 0
  f32.const 1
  local.get $7
  local.get $7
  f32.const 1
  f32.gt
  select
  local.get $7
  f32.const 0
  f32.lt
  select
  global.set $src/cloth/kBend
  local.get $8
  global.set $src/cloth/floorY
 )
 (func $src/cloth/prevPtr (result i32)
  global.get $src/cloth/Q
 )
 (func $src/cloth/posPtr (result i32)
  global.get $src/cloth/P
 )
 (func $src/cloth/poke (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32)
  (local $4 i32)
  local.get $0
  i32.const 0
  i32.lt_s
  local.get $0
  global.get $src/cloth/NV
  i32.ge_s
  i32.or
  if
   return
  end
  local.get $0
  i32.const 4
  i32.shl
  local.tee $4
  global.get $src/cloth/P
  i32.add
  local.tee $0
  local.get $1
  f32.store
  local.get $0
  local.get $2
  f32.store offset=4
  local.get $0
  local.get $3
  f32.store offset=8
  global.get $src/cloth/Q
  local.get $4
  i32.add
  local.tee $0
  local.get $1
  f32.store
  local.get $0
  local.get $2
  f32.store offset=4
  local.get $0
  local.get $3
  f32.store offset=8
 )
 (func $src/cloth/normalY (param $0 i32) (result f32)
  global.get $src/cloth/N
  local.get $0
  i32.const 4
  i32.shl
  i32.add
  f32.load offset=4
 )
 (func $src/cloth/normPtr (result i32)
  global.get $src/cloth/N
 )
 (func $src/cloth/nearestToSphere (result f32)
  (local $0 f32)
  (local $1 f32)
  (local $2 i32)
  (local $3 i32)
  f32.const 1e9
  local.set $1
  loop $for-loop|0
   local.get $3
   global.get $src/cloth/NV
   i32.lt_s
   if
    global.get $src/cloth/P
    local.get $3
    i32.const 4
    i32.shl
    i32.add
    local.tee $2
    f32.load
    global.get $src/cloth/sphX
    f32.sub
    local.tee $0
    local.get $0
    f32.mul
    local.get $2
    f32.load offset=4
    global.get $src/cloth/sphY
    f32.sub
    local.tee $0
    local.get $0
    f32.mul
    f32.add
    local.get $2
    f32.load offset=8
    global.get $src/cloth/sphZ
    f32.sub
    local.tee $0
    local.get $0
    f32.mul
    f32.add
    f64.promote_f32
    f64.sqrt
    f32.demote_f64
    local.tee $0
    local.get $1
    f32.lt
    if
     local.get $0
     local.set $1
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  local.get $1
 )
 (func $src/cloth/init (param $0 i32) (param $1 i32) (param $2 f32) (param $3 f32)
  (local $4 i32)
  (local $5 i32)
  (local $6 f32)
  (local $7 f32)
  (local $8 i32)
  global.get $src/cloth/bufP
  i32.load offset=4
  global.set $src/cloth/P
  global.get $src/cloth/bufQ
  i32.load offset=4
  global.set $src/cloth/Q
  global.get $src/cloth/bufN
  i32.load offset=4
  global.set $src/cloth/N
  global.get $src/cloth/bufIvm
  i32.load offset=4
  global.set $src/cloth/IVM
  global.get $src/cloth/bufUv
  i32.load offset=4
  global.set $src/cloth/UV
  global.get $src/cloth/bufCi
  i32.load offset=4
  global.set $src/cloth/CI
  global.get $src/cloth/bufCj
  i32.load offset=4
  global.set $src/cloth/CJ
  global.get $src/cloth/bufCr
  i32.load offset=4
  global.set $src/cloth/CR
  global.get $src/cloth/bufIdx
  i32.load offset=4
  global.set $src/cloth/IDX
  i32.const 2
  i32.const 96
  local.get $0
  local.get $0
  i32.const 96
  i32.gt_s
  select
  local.get $0
  i32.const 2
  i32.lt_s
  select
  global.set $src/cloth/COLS
  i32.const 2
  i32.const 96
  local.get $1
  local.get $1
  i32.const 96
  i32.gt_s
  select
  local.get $1
  i32.const 2
  i32.lt_s
  select
  global.set $src/cloth/ROWS
  global.get $src/cloth/COLS
  global.get $src/cloth/ROWS
  i32.mul
  i32.const 9216
  i32.gt_s
  if
   i32.const 9216
   global.get $src/cloth/COLS
   i32.div_s
   global.set $src/cloth/ROWS
  end
  global.get $src/cloth/COLS
  global.get $src/cloth/ROWS
  i32.mul
  global.set $src/cloth/NV
  local.get $2
  global.set $src/cloth/SPACING
  local.get $3
  global.set $src/cloth/PIN_Y
  global.get $src/cloth/COLS
  i32.const 1
  i32.sub
  f32.convert_i32_s
  f32.const 0.5
  f32.mul
  local.set $6
  global.get $src/cloth/ROWS
  i32.const 1
  i32.sub
  f32.convert_i32_s
  f32.const 0.5
  f32.mul
  local.set $7
  i32.const 0
  local.set $0
  loop $for-loop|0
   local.get $0
   global.get $src/cloth/ROWS
   i32.lt_s
   if
    i32.const 0
    local.set $1
    loop $for-loop|1
     local.get $1
     global.get $src/cloth/COLS
     i32.lt_s
     if
      global.get $src/cloth/P
      local.get $0
      global.get $src/cloth/COLS
      i32.mul
      local.get $1
      i32.add
      local.tee $4
      i32.const 4
      i32.shl
      i32.add
      local.tee $8
      local.get $1
      f32.convert_i32_s
      local.tee $2
      local.get $6
      f32.sub
      global.get $src/cloth/SPACING
      f32.mul
      f32.store
      local.get $8
      global.get $src/cloth/PIN_Y
      f32.store offset=4
      local.get $8
      local.get $0
      f32.convert_i32_s
      local.tee $3
      local.get $7
      f32.sub
      global.get $src/cloth/SPACING
      f32.mul
      f32.store offset=8
      global.get $src/cloth/UV
      local.get $4
      i32.const 3
      i32.shl
      i32.add
      local.get $2
      global.get $src/cloth/COLS
      i32.const 1
      i32.sub
      f32.convert_i32_s
      f32.div
      f32.store
      global.get $src/cloth/UV
      local.get $4
      i32.const 1
      i32.shl
      i32.const 1
      i32.add
      i32.const 2
      i32.shl
      i32.add
      local.get $3
      global.get $src/cloth/ROWS
      i32.const 1
      i32.sub
      f32.convert_i32_s
      f32.div
      f32.store
      global.get $src/cloth/IVM
      local.get $4
      i32.const 2
      i32.shl
      i32.add
      f32.const 1
      f32.store
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  call $src/cloth/buildConstraints
  i32.const 0
  local.set $0
  loop $for-loop|00
   global.get $src/cloth/ROWS
   local.get $5
   i32.const 1
   i32.add
   i32.gt_s
   if
    i32.const 0
    local.set $1
    loop $for-loop|11
     local.get $1
     i32.const 1
     i32.add
     local.tee $4
     global.get $src/cloth/COLS
     i32.lt_s
     if
      global.get $src/cloth/IDX
      local.get $0
      i32.const 1
      i32.shl
      i32.add
      local.get $5
      global.get $src/cloth/COLS
      i32.mul
      local.get $1
      i32.add
      local.tee $1
      i32.store16
      global.get $src/cloth/IDX
      local.get $0
      i32.const 1
      i32.add
      i32.const 1
      i32.shl
      i32.add
      local.get $1
      global.get $src/cloth/COLS
      i32.add
      local.tee $8
      i32.store16
      global.get $src/cloth/IDX
      local.get $0
      i32.const 2
      i32.add
      i32.const 1
      i32.shl
      i32.add
      local.get $1
      i32.const 1
      i32.add
      local.tee $1
      i32.store16
      global.get $src/cloth/IDX
      local.get $0
      i32.const 3
      i32.add
      local.tee $0
      i32.const 1
      i32.shl
      i32.add
      local.get $1
      i32.store16
      global.get $src/cloth/IDX
      local.get $0
      i32.const 1
      i32.add
      i32.const 1
      i32.shl
      i32.add
      local.get $8
      i32.store16
      global.get $src/cloth/IDX
      local.get $0
      i32.const 2
      i32.add
      i32.const 1
      i32.shl
      i32.add
      local.get $8
      i32.const 1
      i32.add
      i32.store16
      local.get $0
      i32.const 3
      i32.add
      local.set $0
      local.get $4
      local.set $1
      br $for-loop|11
     end
    end
    local.get $5
    i32.const 1
    i32.add
    local.set $5
    br $for-loop|00
   end
  end
  local.get $0
  global.set $src/cloth/NI
  global.get $src/cloth/pinMode
  call $src/cloth/setPinMode
 )
 (func $src/cloth/idxPtr (result i32)
  global.get $src/cloth/IDX
 )
 (func $src/cloth/getVertexCount (result i32)
  global.get $src/cloth/NV
 )
 (func $src/cloth/getStructCount (result i32)
  global.get $src/cloth/nStruct
 )
 (func $src/cloth/getShearCount (result i32)
  global.get $src/cloth/nShear
 )
 (func $src/cloth/getRows (result i32)
  global.get $src/cloth/ROWS
 )
 (func $src/cloth/getPinnedCount (result i32)
  global.get $src/cloth/pinnedN
 )
 (func $src/cloth/getIndexCount (result i32)
  global.get $src/cloth/NI
 )
 (func $src/cloth/getHitCount (result i32)
  global.get $src/cloth/hitCount
 )
 (func $src/cloth/getFloorHits (result i32)
  global.get $src/cloth/floorHits
 )
 (func $src/cloth/getConstraintCount (result i32)
  global.get $src/cloth/nCons
 )
 (func $src/cloth/getCols (result i32)
  global.get $src/cloth/COLS
 )
 (func $src/cloth/getBendCount (result i32)
  global.get $src/cloth/nBend
 )
 (func $src/cloth/extentY (result f32)
  (local $0 f32)
  (local $1 f32)
  (local $2 f32)
  (local $3 i32)
  f32.const 1e9
  local.set $0
  f32.const -1e9
  local.set $2
  loop $for-loop|0
   local.get $3
   global.get $src/cloth/NV
   i32.lt_s
   if
    local.get $0
    global.get $src/cloth/P
    local.get $3
    i32.const 4
    i32.shl
    i32.add
    f32.load offset=4
    local.tee $1
    f32.gt
    if
     local.get $1
     local.set $0
    end
    local.get $1
    local.get $2
    local.get $1
    local.get $2
    f32.gt
    select
    local.set $2
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  local.get $2
  local.get $0
  f32.sub
 )
 (func $src/cloth/constraintError (result f32)
  (local $0 f64)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  global.get $src/cloth/nCons
  i32.eqz
  if
   f32.const 0
   return
  end
  loop $for-loop|0
   local.get $1
   global.get $src/cloth/nCons
   i32.lt_s
   if
    local.get $0
    global.get $src/cloth/P
    local.get $1
    i32.const 1
    i32.shl
    local.tee $3
    global.get $src/cloth/CJ
    i32.add
    i32.load16_u
    i32.const 4
    i32.shl
    i32.add
    local.tee $2
    f32.load
    f64.promote_f32
    global.get $src/cloth/P
    global.get $src/cloth/CI
    local.get $3
    i32.add
    i32.load16_u
    i32.const 4
    i32.shl
    i32.add
    local.tee $3
    f32.load
    f64.promote_f32
    f64.sub
    local.tee $0
    local.get $0
    f64.mul
    local.get $2
    f32.load offset=4
    f64.promote_f32
    local.get $3
    f32.load offset=4
    f64.promote_f32
    f64.sub
    local.tee $0
    local.get $0
    f64.mul
    f64.add
    local.get $2
    f32.load offset=8
    f64.promote_f32
    local.get $3
    f32.load offset=8
    f64.promote_f32
    f64.sub
    local.tee $0
    local.get $0
    f64.mul
    f64.add
    f64.sqrt
    global.get $src/cloth/CR
    local.get $1
    i32.const 2
    i32.shl
    i32.add
    f32.load
    f64.promote_f32
    local.tee $0
    f64.sub
    f64.abs
    local.get $0
    f64.div
    f64.add
    local.set $0
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  local.get $0
  global.get $src/cloth/nCons
  f64.convert_i32_s
  f64.div
  f32.demote_f64
 )
 (func $src/cloth/buildConstraints
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 f32)
  (local $6 i32)
  (local $7 i32)
  i32.const 0
  global.set $src/cloth/nStruct
  i32.const 0
  global.set $src/cloth/nShear
  i32.const 0
  global.set $src/cloth/nBend
  loop $for-loop|0
   local.get $2
   global.get $src/cloth/ROWS
   i32.lt_s
   if
    i32.const 0
    local.set $1
    loop $for-loop|1
     local.get $1
     global.get $src/cloth/COLS
     i32.lt_s
     if
      local.get $2
      global.get $src/cloth/COLS
      i32.mul
      local.get $1
      i32.add
      local.set $6
      global.get $src/cloth/COLS
      local.get $1
      i32.const 1
      i32.add
      i32.gt_s
      if
       local.get $0
       i32.const 1
       i32.shl
       local.tee $7
       global.get $src/cloth/CI
       i32.add
       local.get $6
       i32.store16
       global.get $src/cloth/CJ
       local.get $7
       i32.add
       local.get $6
       i32.const 1
       i32.add
       i32.store16
       global.get $src/cloth/CR
       local.get $0
       i32.const 2
       i32.shl
       i32.add
       global.get $src/cloth/SPACING
       f32.store
       global.get $src/cloth/nStruct
       i32.const 1
       i32.add
       global.set $src/cloth/nStruct
       local.get $0
       i32.const 1
       i32.add
       local.set $0
      end
      global.get $src/cloth/ROWS
      local.get $2
      i32.const 1
      i32.add
      i32.gt_s
      if
       local.get $0
       i32.const 1
       i32.shl
       local.tee $7
       global.get $src/cloth/CI
       i32.add
       local.get $6
       i32.store16
       global.get $src/cloth/CJ
       local.get $7
       i32.add
       local.get $6
       global.get $src/cloth/COLS
       i32.add
       i32.store16
       global.get $src/cloth/CR
       local.get $0
       i32.const 2
       i32.shl
       i32.add
       global.get $src/cloth/SPACING
       f32.store
       global.get $src/cloth/nStruct
       i32.const 1
       i32.add
       global.set $src/cloth/nStruct
       local.get $0
       i32.const 1
       i32.add
       local.set $0
      end
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $for-loop|0
   end
  end
  global.get $src/cloth/SPACING
  global.get $src/cloth/SPACING
  f32.mul
  f32.const 2
  f32.mul
  f64.promote_f32
  f64.sqrt
  f32.demote_f64
  local.set $5
  loop $for-loop|2
   global.get $src/cloth/ROWS
   local.get $4
   i32.const 1
   i32.add
   i32.gt_s
   if
    i32.const 0
    local.set $1
    loop $for-loop|3
     local.get $1
     i32.const 1
     i32.add
     local.tee $2
     global.get $src/cloth/COLS
     i32.lt_s
     if
      local.get $0
      i32.const 1
      i32.shl
      local.tee $6
      global.get $src/cloth/CI
      i32.add
      local.get $4
      global.get $src/cloth/COLS
      i32.mul
      local.get $1
      i32.add
      local.tee $1
      i32.store16
      global.get $src/cloth/CJ
      local.get $6
      i32.add
      local.get $1
      global.get $src/cloth/COLS
      i32.add
      local.tee $6
      i32.const 1
      i32.add
      i32.store16
      global.get $src/cloth/CR
      local.get $0
      i32.const 2
      i32.shl
      i32.add
      local.get $5
      f32.store
      global.get $src/cloth/nShear
      i32.const 1
      i32.add
      global.set $src/cloth/nShear
      local.get $0
      i32.const 1
      i32.add
      local.tee $0
      i32.const 1
      i32.shl
      local.tee $7
      global.get $src/cloth/CI
      i32.add
      local.get $1
      i32.const 1
      i32.add
      i32.store16
      global.get $src/cloth/CJ
      local.get $7
      i32.add
      local.get $6
      i32.store16
      global.get $src/cloth/CR
      local.get $0
      i32.const 2
      i32.shl
      i32.add
      local.get $5
      f32.store
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      global.get $src/cloth/nShear
      i32.const 1
      i32.add
      global.set $src/cloth/nShear
      local.get $2
      local.set $1
      br $for-loop|3
     end
    end
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|2
   end
  end
  loop $for-loop|4
   local.get $3
   global.get $src/cloth/ROWS
   i32.lt_s
   if
    i32.const 0
    local.set $1
    loop $for-loop|5
     local.get $1
     global.get $src/cloth/COLS
     i32.lt_s
     if
      local.get $3
      global.get $src/cloth/COLS
      i32.mul
      local.get $1
      i32.add
      local.set $2
      global.get $src/cloth/COLS
      local.get $1
      i32.const 2
      i32.add
      i32.gt_s
      if
       local.get $0
       i32.const 1
       i32.shl
       local.tee $4
       global.get $src/cloth/CI
       i32.add
       local.get $2
       i32.store16
       global.get $src/cloth/CJ
       local.get $4
       i32.add
       local.get $2
       i32.const 2
       i32.add
       i32.store16
       global.get $src/cloth/CR
       local.get $0
       i32.const 2
       i32.shl
       i32.add
       global.get $src/cloth/SPACING
       global.get $src/cloth/SPACING
       f32.add
       f32.store
       global.get $src/cloth/nBend
       i32.const 1
       i32.add
       global.set $src/cloth/nBend
       local.get $0
       i32.const 1
       i32.add
       local.set $0
      end
      global.get $src/cloth/ROWS
      local.get $3
      i32.const 2
      i32.add
      i32.gt_s
      if
       local.get $0
       i32.const 1
       i32.shl
       local.tee $4
       global.get $src/cloth/CI
       i32.add
       local.get $2
       i32.store16
       global.get $src/cloth/CJ
       local.get $4
       i32.add
       local.get $2
       global.get $src/cloth/COLS
       i32.const 1
       i32.shl
       i32.add
       i32.store16
       global.get $src/cloth/CR
       local.get $0
       i32.const 2
       i32.shl
       i32.add
       global.get $src/cloth/SPACING
       global.get $src/cloth/SPACING
       f32.add
       f32.store
       global.get $src/cloth/nBend
       i32.const 1
       i32.add
       global.set $src/cloth/nBend
       local.get $0
       i32.const 1
       i32.add
       local.set $0
      end
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|5
     end
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|4
   end
  end
  local.get $0
  global.set $src/cloth/nCons
 )
)
