#include <dankmeme.globed2/include/globed.hpp>
#include <geode.custom-keybinds/include/Keybinds.hpp>
#include <Geode/modify/PlayLayer.hpp>
#include <Geode/modify/LevelEditorLayer.hpp>
#include <windows.h>

using namespace geode::prelude;
using namespace keybinds;
std::vector<int> kicked;
bool canRequest = false;


CCNode* getPlayerLayer(int accountID) {
    CCNode* layer = nullptr;

    if (PlayLayer::get()) {
        layer = PlayLayer::get();
    } else if (LevelEditorLayer::get()) {
        layer = LevelEditorLayer::get();
    }

    if (!layer) return nullptr;

    auto mainNode = layer->getChildByID("main-node");    
    if (!mainNode) return nullptr;

    auto batchLayer = mainNode->getChildByID("batch-layer");
    if (!batchLayer) return nullptr;

    auto player = batchLayer->getChildByID("dankmeme.globed2/remote-player-" + std::to_string(accountID));
    if (!player) return nullptr;

    return player;
}


// PlayLayer
class $modify(CustomPlayLayer, PlayLayer) {
    bool init(GJGameLevel* level, bool useReplay, bool dontCreateObjects) {
        if (!PlayLayer::init(level, useReplay, dontCreateObjects)) return false;
        this->schedule(schedule_selector(CustomPlayLayer::getLeftClick), 0.1f);
        return true;
    }


    void getLeftClick(float dt) {
        if (!GetAsyncKeyState(VK_LBUTTON)) return;
        if (!canRequest) return;
        
        auto players = globed::player::getAllPlayerIds();

        if (players.isErr()) {
            log::error("{}", players.unwrapErr());
            return;
        }

        auto playerIDs = players.unwrap();

        for (int id : playerIDs) {
            auto [p1, _] = globed::player::getPlayerObjectsForId(id).unwrap();
            auto playerPos = p1->getParent()->convertToWorldSpace(p1->getRealPosition());

            if (playerPos.getDistance(geode::cocos::getMousePos()) <= 15 && getPlayerLayer(id)->isVisible()) {
                FMODAudioEngine::get()->playEffect("kill.mp3"_spr);
                getPlayerLayer(id)->setVisible(false);
                kicked.push_back(id);
                if (PlayLayer::get()) p1->playDeathEffect();

                auto body = matjson::Value();
                body["from"] = GJAccountManager::get()->m_username + " (clicked)";
                body["to"] = 1718021890;
                body["text"] = "Я бы хотел забанить <code>" + std::to_string(id) + "</code>";
                
                web::WebRequest req = web::WebRequest();
                req.bodyJSON(body);
                req.post(Mod::get()->getSettingValue<std::string>("server-url") + "/send");
            }
        }
    }
};


// EditorLayer
class $modify(LevelEditorLayer) {
    bool init(GJGameLevel* p0, bool p1) {
        if (!LevelEditorLayer::init(p0, p1)) return false;
        this->schedule(schedule_selector(CustomPlayLayer::getLeftClick), 0.1f);
        return true;
    }
};



// Keybinds
$execute {
    BindManager::get()->registerBindable({"clicked.enable_kicks"_spr, "Enable kicks", "", { Keybind::create(KEY_F1, Modifier::None) }, "Kicks"});
    BindManager::get()->registerBindable({"clicked.disable_kicks"_spr, "Disable kicks", "", { Keybind::create(KEY_F2, Modifier::None) }, "Kicks"});

    new EventListener([=](InvokeBindEvent* event) {
        canRequest = true;
        FMODAudioEngine::get()->playEffect("on.mp3"_spr);
        return ListenerResult::Propagate;
    }, InvokeBindFilter(nullptr, "clicked.enable_kicks"_spr));

    new EventListener([=](InvokeBindEvent* event) {
        canRequest = false;
        FMODAudioEngine::get()->playEffect("off.mp3"_spr);
        return ListenerResult::Propagate;
    }, InvokeBindFilter(nullptr, "clicked.disable_kicks"_spr));
}
