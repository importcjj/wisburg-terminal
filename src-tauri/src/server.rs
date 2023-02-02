use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{middleware, post, web, App, Error, HttpResponse, HttpServer, Result};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

#[derive(Deserialize, Serialize, Clone, Debug)]
struct WebchatLoginData {
    token: String,
}

#[post("/web/authorized")]
async fn wechat_login(
    state: web::Data<State>,
    data: web::Json<WebchatLoginData>,
) -> Result<HttpResponse, Error> {
    let data: WebchatLoginData = data.into_inner();
    let main_window = state.tauri.get_window("main").unwrap();

    main_window.emit("web-authorized", data).unwrap();

    Ok(HttpResponse::NoContent().finish())
}

struct State {
    tauri: AppHandle,
}

pub fn setup_async_server(rt: Arc<tokio::runtime::Runtime>, tauri: AppHandle) -> anyhow::Result<()> {
    
    let run = HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_header()
            .allow_any_method();

        App::new()
            .app_data(web::Data::new(State {
                tauri: tauri.clone(),
            }))
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .service(wechat_login)
    })
    .bind(("127.0.0.1", 12438))
    .unwrap()
    .run();


    rt.spawn(async {
        println!("run api server");
        if let Err(e) = run.await {
            eprintln!("{e:?}")
        }
    });

    Ok(())
}
