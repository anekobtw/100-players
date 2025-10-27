#include <dankmeme.globed2/include/globed.hpp>
#include <Geode/modify/PauseLayer.hpp>
#include <Geode/modify/PlayLayer.hpp>
#include <geode.custom-keybinds/include/Keybinds.hpp>
#include <thread>


using namespace geode::prelude;
using namespace keybinds;
bool canRequest = false;


CCNode* getPlayerLayer(int accountID) {
    auto layer = PlayLayer::get();
    if (!layer) return nullptr;

    auto mainNode = layer->getChildByID("main-node");
    if (!mainNode) return nullptr;

    auto batchLayer = mainNode->getChildByID("batch-layer");
    if (!batchLayer) return nullptr;

    auto player = batchLayer->getChildByID("dankmeme.globed2/remote-player-" + std::to_string(accountID));
    if (!player) return nullptr;

    return player;
}


class $modify(CustomPlayLayer, PlayLayer) {
    bool init(GJGameLevel* level, bool useReplay, bool dontCreateObjects) {
        if (!PlayLayer::init(level, useReplay, dontCreateObjects)) return false;

        this->schedule(schedule_selector(CustomPlayLayer::checkForHiding), 0.1f);

        return true;
    }

    void checkForHiding(float dt) {
        auto self = GJBaseGameLayer::get()->m_player1;
        auto players = globed::player::getAllPlayerIds();
        auto selfBox = self->getOrientedBox();

        for (int id : players.unwrap()) {
            auto playerobject = globed::player::getPlayerObjectsForId(id);
            auto [p1, p2] = playerobject.unwrap();

            if (selfBox->overlaps(p1->getOrientedBox()) && getPlayerLayer(id)->isVisible() && canRequest) {
                FMODAudioEngine::get()->playEffect("kill.mp3"_spr);
                getPlayerLayer(id)->setVisible(false);
                p1->playDeathEffect();

                web::WebRequest req = web::WebRequest();

                auto body = matjson::Value();
                body["admin_name"] = GJAccountManager::get()->m_username;
                body["user_id"] = std::to_string(id);

                std::string url = Mod::get()->getSettingValue<std::string>("server-url") + "/request";
                log::info("Sending POST to {}", url);

                req.bodyJSON(body);
                req.post(url);
            }
        }
    }
};


class $modify(CustomPause, PauseLayer) {
    void customSetup() {
        PauseLayer::customSetup();

        const char* txt = (canRequest) ? "Can ban: On" : "Can ban: Off";

        auto label = CCLabelBMFont::create(txt, "bigFont.fnt");
        label->setPosition(35, 5);
        label->setOpacity(125);
        label->setScale(0.3f);

        this->addChild(label);
        this->updateLayout();
    }
};


$execute {
    BindManager::get()->registerBindable({"no_touch.enable_kicks"_spr, "Enable kicks", "", { Keybind::create(KEY_F1, Modifier::None) }, "Kicks"});
    BindManager::get()->registerBindable({"no_touch.disable_kicks"_spr, "Disable kicks", "", { Keybind::create(KEY_F2, Modifier::None) }, "Kicks"});

    new EventListener([=](InvokeBindEvent* event) {
        canRequest = true;
        FMODAudioEngine::get()->playEffect("on.mp3"_spr);
        return ListenerResult::Propagate;
    }, InvokeBindFilter(nullptr, "no_touch.enable_kicks"_spr));

    new EventListener([=](InvokeBindEvent* event) {
        canRequest = false;
        FMODAudioEngine::get()->playEffect("off.mp3"_spr);
        return ListenerResult::Propagate;
    }, InvokeBindFilter(nullptr, "no_touch.disable_kicks"_spr));
}
