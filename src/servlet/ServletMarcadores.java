package servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ServletMarcadores extends HttpServlet{
	public static String json_resposta = null;
	public void init() {
	    try {
	    	new Thread(){
	            public void run(){
	            	setJsonResposta();
	            }
	        }.start();
	    }
	    catch (Exception e) {
	      e.printStackTrace();
	    }
	}
	
	private void setJsonResposta() {
		//String url = "http://rcisistemas.minivps.info:8080/NullServer/viewMap/web";			
		String url = "http://localhost:8080/NullServer/viewMap/web";			
		URL obj;
		try {
			obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod("GET");
			int responseCode = con.getResponseCode();
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
			json_resposta = response.toString();	
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		processa(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		processa(req, resp);
	}

	public void processa(HttpServletRequest request, HttpServletResponse response)throws IOException{
		String tipo = request.getParameter("tipo");
		PrintWriter out = response.getWriter();
		if(tipo == null){
			//atualizar();
			out.println("ok");			
		}else{
			if(json_resposta != null){
				out.println(json_resposta);
			}else{
				String url = "http://localhost:8080/NullServer/viewMap/web";
				//String url = "http://rcisistemas.minivps.info:8080/NullServer/viewMap/web";	
				URL obj;
				try {
					obj = new URL(url);
					HttpURLConnection con = (HttpURLConnection) obj.openConnection();
					con.setRequestMethod("GET");		
					int responseCode = con.getResponseCode();
					BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
					String inputLine;
					StringBuffer response_aux = new StringBuffer();			
					while ((inputLine = in.readLine()) != null) {
						response_aux.append(inputLine);
					}
					in.close();
					json_resposta = response.toString();
					out.println(json_resposta);
				} catch (MalformedURLException e) {
					out.println("Erro");
					e.printStackTrace();
				} catch (IOException e) {
					out.println("Erro");
					e.printStackTrace();
				}
			}
		}	
		out.close();
	}

	private void atualizar() {
		try {
	    	new Thread(){
	            public void run(){
	            	atualisarSetJsonResposta();
	            }
				private void atualisarSetJsonResposta() {
					String url = "http://localhost:8080/NullServer/viewMap/web";
					//String url = "http://rcisistemas.minivps.info:8080/NullServer/viewMap/web";	
					URL obj;
					try {
						obj = new URL(url);
						HttpURLConnection con = (HttpURLConnection) obj.openConnection();
						con.setRequestMethod("GET");				
						int responseCode = con.getResponseCode();			
						BufferedReader in = new BufferedReader(
						        new InputStreamReader(con.getInputStream()));
						String inputLine;
						StringBuffer response = new StringBuffer();	
						while ((inputLine = in.readLine()) != null) {
							response.append(inputLine);
						}
						in.close();
						json_resposta = response.toString();	
					} catch (MalformedURLException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
	        }.start();
	    }
	    catch (Exception e) {
	      e.printStackTrace();
	    }
	}
}