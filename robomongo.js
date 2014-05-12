db.items.group({
    key: {'category': ''},
    reduce: function (curr, result) {
        result.total += 1
    },
    initial: { total: 0 }
})