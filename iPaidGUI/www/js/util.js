/**
 * Created by Tobi on 06/02/15.
 */

function calculateListView(listEntry, pouchPurchWrapper) {
    listEntry.balance = 0;
    listEntry.date = 0;
    console.log(JSON.stringify(listEntry));
    pouchPurchWrapper.all(listEntry._id).forEach(function (entry) {
        listEntry.balance = listEntry.balance + entry.amount;
        console.log("asd");
        if (entry.date > listEntry.date)
            listEntry.date = entry.date;

    });
    console.log(JSON.stringify(listEntry));
    return listEntry;
};

