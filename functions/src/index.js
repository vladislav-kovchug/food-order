const admin = require("firebase-admin");
const functions = require("firebase-functions");
const {google} = require("googleapis");
const {createMenu} = require("./menu/menu");

admin.initializeApp();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const MENU_PATH = "/menu_test";
const MENU_UPDATE_TIMESTAMP_PATH = "/menu_update_timestamp";

exports.loadMenu = functions.https.onRequest(async (req, res) => {
    const auth = await google.auth.getClient({scopes: SCOPES});
    const sheetsApi = google.sheets({version: "v4", auth});

    const sheetIdResult = await getSheetId();
    if (!sheetIdResult || !sheetIdResult.val) {
        const message = `Failed to retrieve sheet id from Firebase`;
        console.error(message);
        res.send(message);
        return res.status(200).end();
    }

    const sheetId = sheetIdResult.val();

    const sheetResult = await read(sheetsApi, sheetId);
    if (!sheetResult || !sheetResult.data || !sheetResult.data.values) {
        const message = `Failed to read data from sheet ${sheetId}`;
        console.error(message);
        res.send(message);
        return res.status(200).end();
    }

    console.info(`Creating menu...`);
    const menu = createMenu(sheetResult.data.values);

    console.info(`Writing menu to Firebase ${MENU_PATH}...`);
    await admin.database().ref(MENU_PATH).set(menu);
    await admin.database().ref(MENU_UPDATE_TIMESTAMP_PATH).set(Date.now());

    console.info("done");

    res.send("done");
    return res.status(200).end();
});

function read(sheetsApi, spreadsheetId) {
    console.info(`Fetching data from sheet ${spreadsheetId}...`);
    return new Promise(resolve => {
        sheetsApi.spreadsheets.values.get({
            spreadsheetId,
            range: "a1:z100"
        }, (err, response) => {
            resolve(err || response);
        });
    });
}

function getSheetId() {
    return admin.database().ref("/menuSheetId").once("value");
}
