async function renderList() {
    let response = await fetch(`/api/plan/list`);    
    if (!response.ok) {
        console.error(response);
        return;
    }

    let data = await response.json();

    let tbodyEl = document.createElement("tbody");
    for (let item of data) {
        let trEl = document.createElement("tr");
        tbodyEl.append(trEl);

        let tdEl;
        tdEl = document.createElement("td");
        tdEl.innerText = item.plan_xueqi;
        tdEl.className = "col-plan_xueqi";
        trEl.append(tdEl);

        tdEl = document.createElement("td");
        tdEl.className = "col-cuo_name";
        tdEl.innerText = item.cuo_name;
        trEl.append(tdEl);

        tdEl = document.createElement("td");
        tdEl.className = "col-plan_time";
        tdEl.innerText = item.plan_time;
        trEl.append(tdEl);

        tdEl = document.createElement("td");
        tdEl.className = "col-plan_time2";
        tdEl.innerText = item.plan_jieci;
        trEl.append(tdEl);


        tdEl = document.createElement("td");
        tdEl.className = "col-plan_didian";
        tdEl.innerText = item.plan_didian;
        trEl.append(tdEl);

        tdEl = document.createElement("td");
        tdEl.className = "";
        trEl.append(tdEl);

        tdEl = document.createElement("td");
        tdEl.className = "ctrlbar";
        tdEl.append(renderRecordCtrlbar(item));
        trEl.append(tdEl);
    }

    let tableEl = document.querySelector("#plan-table");
    document.querySelector("#plan-table > tbody").remove();
    tableEl.append(tbodyEl);
}

function renderRecordCtrlbar(item) {
    let ctrlbarEl = document.createElement("div");

    let editBtn = document.createElement("a");
    editBtn.className = "btn";
    editBtn.innerText = "修改";
    editBtn.onclick = (e) => {
        openEditDialog(item);
    };
    ctrlbarEl.append(editBtn);

    let delBtn = document.createElement("a");
    delBtn.className = "btn";
    delBtn.innerText = "删除";
    delBtn.onclick = (e) => {
        openComfirmationDialog({
            message: `确定要删除“${item.plan_name}(#${item.plan_sn})”的信息？`,
            onOk: () => {
                (async () => {
                    let response = await fetch(`/api/plan/${item.plan_sn}`, {
                        method: "DELETE",
                    });

                    if (!response.ok) {
                        console.error(response);
                    }

                    renderList();
                })();
            },
        });
    };
    ctrlbarEl.append(delBtn);

    return ctrlbarEl;
}

async function openEditDialog(item) {
    let dialog = document.querySelector(".plan-editor");

    let dialogTitle = dialog.querySelector(".dialog-head");
    let form = dialog.querySelector("form");

    if (item) {
        dialogTitle.innerText = `修改课表 (#${item.plan_sn})`;
        form.elements.plan_sn.value = item.plan_sn ?? null;
        form.elements.plan_xueqi.value = item.plan_xueqi ?? "";
        form.elements.cuo_sn.value = item.cuo_sn ?? "";
        form.elements.plan_time.value = item.plan_time ?? "";
        form.elements.plan_time2.value = item.plan_jieci ?? "";
        form.elements.plan_didian.value = item.plan_didian ?? "";
    } else {
        dialogTitle.innerText = "新建课表";
        form.elements.plan_sn.value = null;
        form.elements.plan_xueqi.value = "";
        form.elements.cuo_sn.value = "";
        form.elements.plan_time.value = "";
        form.elements.plan_time2.value = "";
        form.elements.plan_didian.value = "";
    }

    if (dialog.classList.contains("open")) {
        dialog.classList.remove("open");
    } else {
        dialog.classList.add("open");
    }
}

async function renderEditDialog() {
    let newplantBtn = document.querySelector(".paper #new-btn");
    newplantBtn.onclick = (e) => {
        openEditDialog();
    };

    let dialog = document.querySelector(".plan-editor");

    let form = dialog.querySelector("form");

    let close_btn = dialog.querySelector("#close-btn");

    let closeDialog = () => {
        dialog.classList.remove("open");
    };

    close_btn.onclick = closeDialog;

    let save_btn = dialog.querySelector("#save-btn");
    save_btn.onclick = (e) => {
        let data = {
            plan_sn: form.elements.plan_sn.value,
            plan_xueqi: form.elements.plan_xueqi.value,
            plan_name: form.elements.cuo_sn.value,
            plan_time: form.elements.plan_time.value,
            plan_jieci: form.elements.plan_time2.value,
            plan_didian: form.elements.plan_didian.value,
        };

        if (!data.plan_sn) {
            // 异步执行POST请求操作
            (async () => {
                let response = await fetch("/api/plan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    console.error(response);
                    return;
                }
                closeDialog();
                renderList();
            })();
        } else {
            // 异步执行PUT请求操作
            (async () => {
                let response = await fetch(`/api/plan/${data.plan_sn}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    console.error(response);
                    return;
                }
                closeDialog();
                renderList();
            })();
        }
    };
}

async function openComfirmationDialog({ message, onOk, onCancel }) {
    let dialog = document.querySelector(".comfirmation-dialog");

    let closeDialog = () => {
        dialog.classList.remove("open");
    };

    let okBtn = dialog.querySelector("#ok-btn");
    okBtn.onclick = (e) => {
        if (typeof onOk === "function") {
            onOk();
        }

        closeDialog();
    };

    let cancelBtn = dialog.querySelector("#cancel-btn");
    cancelBtn.onclick = (e) => {
        if (typeof onCancel === "function") {
            onCancel();
        }

        closeDialog();
    };

    let messageEl = dialog.querySelector("#message");
    messageEl.innerText = message;

    dialog.classList.add("open");
}

document.addEventListener("DOMContentLoaded", (e) => {
    renderList();
    renderEditDialog();
});