#include "init_test.h"
void init(v8::Handle<v8::Object> exports, v8::Handle<v8::Context> context) {
  NODE_TEST_ADDON_INIT_TAG(exports);
}
NODE_MODULE(NODE_TEST_ADDON_NAME, init)
