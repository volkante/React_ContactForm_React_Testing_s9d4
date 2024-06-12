import { afterEach, beforeEach, expect, test } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import fs from "fs";
import path from "path";

//eksik import buraya
import IletisimFormu from "./IletisimFormu";
//fixin tuzağı buraya? detaylar readme dosyasında.

beforeEach(() => {
  render(<IletisimFormu />);
});

test("[1] hata olmadan render ediliyor", () => {
  // expect('kodlarınızı yazınca').toBe('bu assertionı silin!!!');
});

test("[2] iletişim formu headerı render ediliyor", () => {
  //get by text ile h1 tagini yakalayın
  //to be in the document, to be truthy, to have text content ile kontrol edin.
  const formTitle = screen.getByText("İletişim Formu");
  expect(formTitle).toBeInTheDocument();
  expect(formTitle).toBeTruthy();
  expect(formTitle).toHaveTextContent("İletişim Formu");
});

test("[3] kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  //get by label text ile name alanını yakalayınız
  const nameInput = screen.getByLabelText("Ad*");
  userEvent.type(nameInput, "sfd");
  //find all by test id ile error mesajı yakalayın
  const errorMessages = await screen.findAllByTestId("error");
  //to have length ile kontrol edin.

  expect(errorMessages).toHaveLength(1);
});

test("[4] kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  //hiç bir alanı doldurmadan get by role ile butonu yakalayın
  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn); //B.N. burası çok anlaşılır değil. Ama iletisimFormu.jsx'i inceleyince gerçekte error'ları
  //ancak submit edince set ediyor. Errormessages'larla karıştırmaya müsait. Bir önceki testte errormessages istiyor. İkisi farklı.
  //Bu instruction'lar kafa karıştırıcı. Alttaki testte de aynısı geçerli. SON NOT: KARIŞIK ASLINDA ALTTAKİ VE ÜSTTEKİ DE MESSAGES'MIŞ!
  //error mesajlarının to have lengthine bakarak kontrol edin
  const errors = await screen.findAllByTestId("error");
  expect(errors).toHaveLength(3);
});

test("[5] kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  //get by test id ile input alanlarını yakalayın
  const nameInput = screen.getByTestId("name-input");
  const lastNameInput = screen.getByTestId("lastName-input");
  const submitBtn = screen.getByRole("button");
  userEvent.type(nameInput, "mehmet");
  userEvent.type(lastNameInput, "karalar");
  userEvent.click(submitBtn);
  const errorMessages = await screen.findAllByTestId("error");
  //error mesajlarının to have lengthine bakarak kontrol edin
  expect(errorMessages).toHaveLength(1);
});

test('[6] geçersiz bir mail girildiğinde "Hata: email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  //errorı get by test id ile yakalayın
  const emailInput = screen.getByTestId("email-input");
  userEvent.type(emailInput, "d");
  const errorMessage = await screen.findByTestId("error");
  //to have text content ile hata metnini kontrol edin
  expect(errorMessage).toHaveTextContent(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
});

test('[7] soyad girilmeden gönderilirse "Hata: soyad gereklidir." mesajı render ediliyor', async () => {
  //find by text ve to be in the document ile hata metni ekranda mı kontrol edin
  const submitBtn = screen.getByRole("button");
  userEvent.click(submitBtn);
  const errorText = await screen.findByText("Hata: soyad gereklidir.");
  expect(errorText).toBeInTheDocument();
});

test("[8] ad, soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const nameInput = screen.getByTestId("name-input");
  const lastNameInput = screen.getByTestId("lastName-input");
  const emailInput = screen.getByTestId("email-input");
  const submitBtn = screen.getByRole("button");

  userEvent.type(nameInput, "mehmet");
  userEvent.type(lastNameInput, "karalar");
  userEvent.type(emailInput, "alikaralar@gmail.com");
  userEvent.click(submitBtn);

  const renderedName = await screen.findByTestId("firstnameDisplay");
  const renderedLastname = await screen.findByTestId("lastnameDisplay");
  const renderedEmail = await screen.findByTestId("emailDisplay");
  const error = screen.queryByTestId("error");

  expect(renderedEmail).toBeInTheDocument();
  expect(renderedName).toBeInTheDocument();
  expect(renderedLastname).toBeInTheDocument();
  expect(error).not.toBeInTheDocument();
});

test("[9] form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const nameInput = screen.getByTestId("name-input");
  const lastNameInput = screen.getByTestId("lastName-input");
  const emailInput = screen.getByTestId("email-input");
  const msg = screen.getByTestId("message-input");
  const submitBtn = screen.getByRole("button");

  userEvent.type(nameInput, "mehmet");
  userEvent.type(lastNameInput, "karalar");
  userEvent.type(emailInput, "alikaralar@gmail.com");
  userEvent.type(msg, "hayırlı olsun");
  userEvent.click(submitBtn);

  const renderedName = await screen.findByTestId("firstnameDisplay");
  const renderedLastname = await screen.findByTestId("lastnameDisplay");
  const renderedEmail = await screen.findByTestId("emailDisplay");
  const renderedMsg = await screen.findByTestId("messageDisplay");

  expect(renderedEmail).toBeInTheDocument();
  expect(renderedName).toBeInTheDocument();
  expect(renderedLastname).toBeInTheDocument();
  expect(renderedMsg).toBeInTheDocument();
});

//

//

// BURADAN SONRASINA DOKUNMAYIN //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const testFile = fs
  .readFileSync(path.resolve(__dirname, "./IletisimFormu.test.jsx"), "utf8")
  .replaceAll(/(?:\\r\\n|\\r|\\n| )/g, "");
const tests = testFile.split("test('[");

test("Kontrol: IletisimFormu componenti import edilmiş.", async () => {
  expect(tests[0]).toContain("importIletisimFormufrom");
});

test("Kontrol: test[1] için render metodu kullanılmış", async () => {
  expect(tests[1]).toContain("render(<IletisimFormu");
});

test("Kontrol: test[2] için screen.getByText(...) kullanılmış", async () => {
  expect(tests[2]).toContain("screen.getByText(");
});

test("Kontrol: test[2] için .toBeInTheDocument() ile kontrol edilmiş", async () => {
  expect(tests[2]).toContain(".toBeInTheDocument()");
});

test("Kontrol: test[2] için .toBeTruthy() ile kontrol edilmiş", async () => {
  expect(tests[2]).toContain(".toBeTruthy()");
});

test("Kontrol: test[2] için .toHaveTextContent(...) ile kontrol edilmiş", async () => {
  expect(tests[2]).toContain(".toHaveTextContent(");
});

test("Kontrol: test[3] için screen.getByLabelText(...) kullanılmış", async () => {
  expect(tests[3]).toContain("screen.getByLabelText(");
});

test("Kontrol: test[3] için screen.findAllByTestId(...) kullanılmış", async () => {
  expect(tests[3]).toContain("screen.findAllByTestId(");
});

test("Kontrol: test[3] için findAllByTestId await ile kullanılmış", async () => {
  expect(tests[3]).toContain("awaitscreen.findAllByTestId");
});

test("Kontrol: test[3] için .toHaveLength(...) ile kontrol edilmiş", async () => {
  expect(tests[3]).toContain(".toHaveLength(1)");
});

test("Kontrol: test[4] için .getByRole(...) kullanılmış ", async () => {
  expect(tests[4]).toContain("screen.getByRole(");
});

test("Kontrol: test[4] için .toHaveLength(...) ile kontrol edilmiş", async () => {
  expect(tests[4]).toContain(".toHaveLength(3)");
});

test("Kontrol: test[5] için .getByTestId(...) kullanılmış", async () => {
  expect(tests[5]).toContain("screen.getByTestId(");
});

test("Kontrol: test[5] için .toHaveLength(...) ile kontrol edilmiş", async () => {
  expect(tests[5]).toContain(".toHaveLength(1)");
});

test("Kontrol: test[6] için .getByTestId(...) kullanılmış", async () => {
  expect(tests[6]).toContain("screen.getByTestId(");
});

test("Kontrol: test[6] için .toHaveTextContent(...) ile kontrol edilmiş", async () => {
  expect(tests[6]).toContain(").toHaveTextContent(");
});

test("Kontrol: test[7] için .findByText(...) await ile kullanılmış", async () => {
  expect(tests[7]).toContain("awaitscreen.findByText(");
});

test("Kontrol: test[7] için .toBeInTheDocument() ile kontrol edilmiş", async () => {
  expect(tests[7]).toContain(").toBeInTheDocument()");
});

test("Kontrol: tüm testlerde(test1 hariç) iletişim formu ayrı ayrı render edilmesi yerine beforeEach hooku kullılarak, render içinde yapılmış.", async () => {
  expect(tests[0]).toContain("beforeEach(()=>{");
  expect(tests[0]).toContain("render(<IletisimFormu/>)");
});
